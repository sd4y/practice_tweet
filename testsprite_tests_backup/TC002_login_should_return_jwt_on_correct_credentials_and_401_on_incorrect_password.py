import requests

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def test_login_should_return_jwt_on_correct_credentials_and_401_on_incorrect_password():
    signup_url = f"{BASE_URL}/auth/signup"
    login_url = f"{BASE_URL}/auth/login"
    headers = {"Content-Type": "application/json"}

    test_email = "testuser_login@example.com"
    test_username = "testuser_login"
    test_password = "correct_password"
    test_name = "Test User Login"

    # Step 1: Create a new user to test login against
    signup_payload = {
        "email": test_email,
        "username": test_username,
        "password": test_password,
        "name": test_name
    }

    try:
        signup_resp = requests.post(signup_url, json=signup_payload, headers=headers, timeout=TIMEOUT)
        assert signup_resp.status_code == 201 or signup_resp.status_code == 409, (
            f"Unexpected signup status code: {signup_resp.status_code}, response: {signup_resp.text}"
        )
    except requests.RequestException as e:
        raise AssertionError(f"Signup request failed: {e}")

    # Step 2: Login with correct credentials and assert JWT in response
    login_payload_correct = {
        "email": test_email,
        "password": test_password
    }
    try:
        login_resp = requests.post(login_url, json=login_payload_correct, headers=headers, timeout=TIMEOUT)
        assert login_resp.status_code == 200, (
            f"Login with correct credentials failed with status {login_resp.status_code}, response: {login_resp.text}"
        )
        json_resp = login_resp.json()
        assert "access_token" in json_resp, "JWT token not found in login response"
        token = json_resp.get("access_token")
        assert isinstance(token, str) and len(token) > 10, "JWT token appears invalid"
    except requests.RequestException as e:
        raise AssertionError(f"Login request with correct credentials failed: {e}")

    # Step 3: Login with incorrect password and assert 401 Unauthorized response
    login_payload_incorrect = {
        "email": test_email,
        "password": "incorrect_password"
    }
    try:
        login_resp_bad = requests.post(login_url, json=login_payload_incorrect, headers=headers, timeout=TIMEOUT)
        assert login_resp_bad.status_code == 401, (
            f"Login with incorrect password did not return 401, got {login_resp_bad.status_code}, response: {login_resp_bad.text}"
        )
    except requests.RequestException as e:
        raise AssertionError(f"Login request with incorrect password failed: {e}")

test_login_should_return_jwt_on_correct_credentials_and_401_on_incorrect_password()