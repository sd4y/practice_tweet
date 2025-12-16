import requests
import uuid

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def signup_user(email, username, password, name):
    url = f"{BASE_URL}/auth/signup"
    payload = {
        "email": email,
        "username": username,
        "password": password,
        "name": name
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    json_resp = resp.json()
    assert "id" in json_resp, "Signup response missing expected 'id' field"
    return json_resp

def login_user(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": email,
        "password": password
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    json_resp = resp.json()
    assert "token" in json_resp, "Login response missing 'token'"
    return json_resp["token"]

def get_user_profile(username, token):
    url = f"{BASE_URL}/users/{username}"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def follow_user(user_id, token):
    url = f"{BASE_URL}/users/{user_id}/follow"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp

def unfollow_user(user_id, token):
    url = f"{BASE_URL}/users/{user_id}/follow"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.delete(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp

def unfollow_user_should_update_follower_counts_correctly():
    # Create two users: follower and followee
    follower_email = f"user_follower_{uuid.uuid4()}@test.com"
    follower_username = f"userfollower{uuid.uuid4().hex[:8]}"
    follower_password = "Password123!"
    follower_name = "Follower User"

    followee_email = f"user_followee_{uuid.uuid4()}@test.com"
    followee_username = f"userfollowee{uuid.uuid4().hex[:8]}"
    followee_password = "Password123!"
    followee_name = "Followee User"

    try:
        # Signup follower
        signup_user(follower_email, follower_username, follower_password, follower_name)
        follower_token = login_user(follower_email, follower_password)

        # Signup followee
        signup_user(followee_email, followee_username, followee_password, followee_name)
        followee_token = login_user(followee_email, followee_password)

        # Get followee profile before follow
        followee_profile_before = get_user_profile(followee_username, follower_token)
        followers_count_before = followee_profile_before.get("followersCount", 0)

        # Follower follows followee
        followee_user_id = followee_profile_before.get("id")
        follow_resp = follow_user(followee_user_id, follower_token)
        assert follow_resp.status_code == 200 or follow_resp.status_code == 204

        # Confirm follower count incremented
        followee_profile_after_follow = get_user_profile(followee_username, follower_token)
        followers_count_after_follow = followee_profile_after_follow.get("followersCount", 0)
        assert followers_count_after_follow == followers_count_before + 1

        # Follower unfollows followee
        unfollow_resp = unfollow_user(followee_user_id, follower_token)
        assert unfollow_resp.status_code == 200 or unfollow_resp.status_code == 204

        # Confirm follower count decremented back
        followee_profile_after_unfollow = get_user_profile(followee_username, follower_token)
        followers_count_after_unfollow = followee_profile_after_unfollow.get("followersCount", 0)
        assert followers_count_after_unfollow == followers_count_before

    finally:
        # Clean up: ideally delete users but no endpoint info provided; test infra cleanup assumed

        # Optionally unfollow in case of failure before unfollow
        try:
            unfollow_user(followee_user_id, follower_token)
        except:
            pass


unfollow_user_should_update_follower_counts_correctly()
