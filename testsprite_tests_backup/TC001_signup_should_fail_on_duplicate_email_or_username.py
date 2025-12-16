import requests
import uuid

BASE_URL = "http://localhost:3001"
SIGNUP_URL = f"{BASE_URL}/auth/signup"
TIMEOUT = 30

def signup_should_fail_on_duplicate_email_or_username():
    # Generate unique email and username for initial signup
    unique_suffix = str(uuid.uuid4())
    user_data = {
        "email": f"testuser{unique_suffix}@example.com",
        "username": f"testuser{unique_suffix}",
        "password": "SecureP@ssword123",
        "name": "Test User"
    }
    
    created_user = None
    try:
        # First signup attempt should succeed
        resp = requests.post(SIGNUP_URL, json=user_data, timeout=TIMEOUT)
        assert resp.status_code == 201 or resp.status_code == 200, f"Expected 200 or 201, got {resp.status_code}"
        created_user = resp.json()

        # Second signup attempt with SAME email should fail
        duplicate_email_data = {
            "email": user_data["email"],
            "username": f"diffusername{unique_suffix}",
            "password": "AnotherP@ssword123",
            "name": "Another User"
        }
        resp_email_dup = requests.post(SIGNUP_URL, json=duplicate_email_data, timeout=TIMEOUT)
        assert resp_email_dup.status_code == 400 or resp_email_dup.status_code == 409, \
            f"Expected 400 or 409 for duplicate email, got {resp_email_dup.status_code}"

        # Second signup attempt with SAME username should fail
        duplicate_username_data = {
            "email": f"diffemail{unique_suffix}@example.com",
            "username": user_data["username"],
            "password": "AnotherP@ssword123",
            "name": "Another User"
        }
        resp_username_dup = requests.post(SIGNUP_URL, json=duplicate_username_data, timeout=TIMEOUT)
        assert resp_username_dup.status_code == 400 or resp_username_dup.status_code == 409, \
            f"Expected 400 or 409 for duplicate username, got {resp_username_dup.status_code}"

    finally:
        # Cleanup is not possible via API deletion endpoint as per PRD, so skip deletion

        # If there was an admin or user deletion endpoint this is where we would clean up.
        pass

signup_should_fail_on_duplicate_email_or_username()
