import requests
import string
import random

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

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
    data = resp.json()
    token = data.get("access_token") or data.get("token") or data.get("jwt") or data.get("jwtToken")
    assert token, "Login response did not contain a JWT token"
    return token

def follow_user(auth_token, user_id_to_follow):
    url = f"{BASE_URL}/users/{user_id_to_follow}/follow"
    headers = {"Authorization": f"Bearer {auth_token}"}
    resp = requests.post(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def unfollow_user(auth_token, user_id_to_unfollow):
    url = f"{BASE_URL}/users/{user_id_to_unfollow}/follow"
    headers = {"Authorization": f"Bearer {auth_token}"}
    resp = requests.delete(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def get_user_profile(auth_token, username):
    url = f"{BASE_URL}/users/{username}"
    headers = {"Authorization": f"Bearer {auth_token}"}
    resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    return resp

def test_get_user_profile_should_be_case_insensitive_and_return_following_status():
    # Create two users: user A (requesting user) and user B (target user)
    email_a = f"{random_string(5)}@example.com"
    username_a = random_string(8)
    password_a = "Password123!"
    name_a = "User A"
    
    email_b = f"{random_string(5)}@example.com"
    username_b = random_string(8)
    password_b = "Password123!"
    name_b = "User B"

    token_a = None

    try:
        # Sign up user A and user B
        signup_user(email_a, username_a, password_a, name_a)
        signup_user(email_b, username_b, password_b, name_b)

        # Login user A and user B to get JWT tokens
        token_a = login_user(email_a, password_a)
        token_b = login_user(email_b, password_b)

        # Get user profiles to obtain IDs
        resp_profile_a = get_user_profile(token_a, username_a)
        resp_profile_b = get_user_profile(token_a, username_b)

        assert resp_profile_a.status_code == 200, "Failed to get profile for user A"
        assert resp_profile_b.status_code == 200, "Failed to get profile for user B"

        user_a_profile = resp_profile_a.json()
        user_b_profile = resp_profile_b.json()

        user_a_id = user_a_profile.get("id")
        user_b_id = user_b_profile.get("id")

        assert user_a_id is not None, "Profile response for user A missing 'id'"
        assert user_b_id is not None, "Profile response for user B missing 'id'"

        # user A follows user B
        follow_user(token_a, user_b_id)

        # Test case insensitivity: create variants of username_b with mixed case
        username_variants = [
            username_b.upper(),
            username_b.lower(),
            username_b.capitalize(),
            username_b.swapcase()
        ]

        for variant in username_variants:
            response = get_user_profile(token_a, variant)
            assert response.status_code == 200, \
                f"Expected 200 OK for username variant '{variant}', got {response.status_code}"
            profile_data = response.json()
            assert "username" in profile_data, "Response missing 'username'"
            assert profile_data["username"].lower() == username_b.lower(), \
                f"Username in response '{profile_data['username']}' does not match requested '{variant}' case-insensitively"
            assert "following" in profile_data, "'following' field missing in profile response"
            assert profile_data["following"] is True, \
                f"'following' status should be True as user A follows user B for variant '{variant}'"

        # Additionally test a username variant that user A does NOT follow (own profile)
        response_self = get_user_profile(token_a, username_a.upper())
        assert response_self.status_code == 200, "Expected 200 OK for user's own profile"
        profile_self = response_self.json()
        assert profile_self["username"].lower() == username_a.lower()
        assert "following" in profile_self
        # Following status for own profile should be False or omitted, check False if present
        if profile_self.get("following") is not None:
            assert profile_self["following"] is False, "User should not be 'following' themselves"

    finally:
        # Cleanup: unfollow user B if token exists
        if token_a and user_b_id:
            try:
                unfollow_user(token_a, user_b_id)
            except Exception:
                pass

        # Cleanup users if delete user endpoint existed
        # Since no delete user endpoint specified in PRD, skipping user deletion

test_get_user_profile_should_be_case_insensitive_and_return_following_status()
