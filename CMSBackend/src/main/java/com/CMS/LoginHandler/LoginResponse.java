package com.CMS.LoginHandler;

public class LoginResponse {
	private String Message;
    private String token;
    private String userType;
    private Long id;

    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public LoginResponse(String Message, String token,String  userType,Long id) {
        this.Message = Message;
        this.token = token;
        this.userType = userType;
        this.id=id;

    }
	public LoginResponse(String message, String token, Long id) {
		this(message, token, null, id);
	}

	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
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
