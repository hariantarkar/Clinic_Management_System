package com.CMS.LoginHandler;

public class LoginResponse {
	private String Message;
    private String token;

    public LoginResponse(String Message, String token) {
        this.Message = Message;
        this.token = token;
    }

	public String getMessage() {
		return Message;
	}

	public void setMessage(String message) {
		Message = message;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}
