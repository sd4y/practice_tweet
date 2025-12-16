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
    return resp.json()

def login_user(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": email,
        "password": password
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    json_resp = resp.json()
    # The token may be under 'token' or 'accessToken'; assert at least one is present
    token = json_resp.get("token") or json_resp.get("accessToken")
    assert token is not None, f"Login response missing token field: {json_resp}"
    return token

def get_user_profile(username, token):
    url = f"{BASE_URL}/users/{username}"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def post_follow_user(user_id, token):
    url = f"{BASE_URL}/users/{user_id}/follow"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(url, headers=headers, timeout=TIMEOUT)
    return resp

def delete_user(user_id, token):
    # No delete user endpoint described in PRD, so skip deleting created users
    pass

def test_follow_user_should_prevent_self_follow_and_update_follower_counts():
    # Create two distinct users for this test
    unique_suffix1 = uuid.uuid4().hex[:8]
    unique_suffix2 = uuid.uuid4().hex[:8]
    email1 = f"user1_{unique_suffix1}@example.com"
    username1 = f"user1_{unique_suffix1}"
    password1 = "Password123!"
    name1 = "User One"

    email2 = f"user2_{unique_suffix2}@example.com"
    username2 = f"user2_{unique_suffix2}"
    password2 = "Password123!"
    name2 = "User Two"

    # Signup user1
    signup_user(email1, username1, password1, name1)
    token1 = login_user(email1, password1)
    user1_profile = get_user_profile(username1, token1)
    user1_id = user1_profile.get("id") or user1_profile.get("userId")
    assert user1_id is not None, "User1 creation failed: no user id returned"

    # Signup user2
    signup_user(email2, username2, password2, name2)
    token2 = login_user(email2, password2)
    user2_profile = get_user_profile(username2, token2)
    user2_id = user2_profile.get("id") or user2_profile.get("userId")
    assert user2_id is not None, "User2 creation failed: no user id returned"

    try:
        # user1 tries to follow self - should fail
        resp = post_follow_user(user1_id, token1)
        assert resp.status_code == 400 or resp.status_code == 403, \
            f"Expected 400 or 403 when user follows self, got {resp.status_code}"
        # We expect error message about self-follow prevented
        error_json = resp.json()
        assert "cannot follow yourself" in str(error_json).lower() or "self" in str(error_json).lower(), \
            "Expected error message about self-follow prevention"

        # Get user2 profile before follow to check follower count
        profile_before = get_user_profile(username2, token1)
        followers_before = profile_before.get("followersCount", profile_before.get("followers", 0))

        # user1 follows user2 - success expected
        resp = post_follow_user(user2_id, token1)
        assert resp.status_code == 200, f"Expected 200 OK when following another user, got {resp.status_code}"

        # Get user2 profile after follow to check follower count incremented
        profile_after = get_user_profile(username2, token1)
        followers_after = profile_after.get("followersCount", profile_after.get("followers", 0))

        assert followers_after == followers_before + 1, \
            f"Follower count did not increment correctly: before={followers_before}, after={followers_after}"

        # Also verify that user1's following count increments if available
        profile1 = get_user_profile(username1, token1)
        following_before = profile1.get("followingCount", profile1.get("following", 0))
        # Ideally following count should have updated but may not if cache delay; so just check >= 1
        assert following_before >= 1, \
            f"User1 following count seems incorrect: {following_before}"

    finally:
        # Cleanup users if deletion API was available
        # No user deletion endpoint info so skipping actual delete
        pass

test_follow_user_should_prevent_self_follow_and_update_follower_counts()
