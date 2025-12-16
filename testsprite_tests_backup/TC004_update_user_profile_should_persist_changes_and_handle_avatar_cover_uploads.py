import requests
import io

BASE_URL = "http://localhost:3001"
TIMEOUT = 30


def test_update_user_profile_should_persist_changes_and_handle_avatar_cover_uploads():
    # Step 1: Sign up a new user
    signup_data = {
        "email": "testuser_tc004@example.com",
        "username": "testuser_tc004",
        "password": "TestPass123!",
        "name": "Test User TC004"
    }
    signup_resp = requests.post(
        f"{BASE_URL}/auth/signup", json=signup_data, timeout=TIMEOUT
    )
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
    # Step 2: Login to get JWT token
    login_data = {
        "email": signup_data["email"],
        "password": signup_data["password"]
    }
    login_resp = requests.post(
        f"{BASE_URL}/auth/login", json=login_data, timeout=TIMEOUT
    )
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json().get("access_token")
    assert token, "JWT token missing in login response"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Prepare sample avatar and cover image bytes (simple PNG header + minimal content)
    avatar_bytes = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
        b"\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
        b"\x00\x00\x00\nIDATx\xdacd\xf8\x0f\x00\x01\x01\x01\x00"
        b"\x18\xdd\x03\xed\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    cover_bytes = avatar_bytes  # reuse same minimal image for cover

    # Step 3: Upload avatar image
    avatar_files = {'file': ('avatar.png', io.BytesIO(avatar_bytes), 'image/png')}
    upload_avatar_resp = requests.post(
        f"{BASE_URL}/uploads", files=avatar_files, headers=headers, timeout=TIMEOUT
    )
    assert upload_avatar_resp.status_code == 201, f"Avatar upload failed: {upload_avatar_resp.text}"
    avatar_url = upload_avatar_resp.json().get("url")
    assert avatar_url and avatar_url.strip(), "Avatar URL missing in upload response"

    # Step 4: Upload cover image
    cover_files = {'file': ('cover.png', io.BytesIO(cover_bytes), 'image/png')}
    upload_cover_resp = requests.post(
        f"{BASE_URL}/uploads", files=cover_files, headers=headers, timeout=TIMEOUT
    )
    assert upload_cover_resp.status_code == 201, f"Cover upload failed: {upload_cover_resp.text}"
    cover_url = upload_cover_resp.json().get("url")
    assert cover_url and cover_url.strip(), "Cover URL missing in upload response"

    # Step 5: Patch the user profile with updated data including avatar and cover URLs
    updated_profile_data = {
        "name": "Updated Test User TC004",
        "bio": "This is a bio updated by automated test TC004.",
        "location": "Test Location",
        "website": "https://example.com/tc004",
        "avatar": avatar_url,
        "cover": cover_url
    }
    patch_resp = requests.patch(
        f"{BASE_URL}/users/profile", json=updated_profile_data, headers=headers, timeout=TIMEOUT
    )
    assert patch_resp.status_code == 200, f"Profile update failed: {patch_resp.text}"
    patch_resp_json = patch_resp.json()
    for key, val in updated_profile_data.items():
        assert patch_resp_json.get(key) == val, f"Profile field '{key}' mismatch"

    # Step 6: Retrieve profile to verify persistence
    profile_resp = requests.get(
        f"{BASE_URL}/users/{signup_data['username']}", headers=headers, timeout=TIMEOUT
    )
    assert profile_resp.status_code == 200, f"Get profile failed: {profile_resp.text}"
    profile_json = profile_resp.json()
    for key, val in updated_profile_data.items():
        assert profile_json.get(key) == val, f"Persisted profile field '{key}' mismatch"

    # Cleanup: Delete the test user (assuming there's a delete profile or user endpoint)
    try:
        resp = requests.delete(f"{BASE_URL}/users/profile", headers=headers, timeout=TIMEOUT)
        assert resp.status_code in (200, 204), f"Cleanup delete user failed: {resp.text}"
    except Exception:
        # If no delete endpoint, pass
        pass


test_update_user_profile_should_persist_changes_and_handle_avatar_cover_uploads()
