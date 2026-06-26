package com.CMS.LoginHandler;

public class LoginResponse {
	private String Message;
    private String token;
    private String userType;
    private Long id;
    private String name;

    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public LoginResponse(String Message, String token,String  userType,Long id,String name) {
        this.Message = Message;
        this.token = token;
        this.userType = userType;
        this.id=id;
        this.name=name;

    }
	/*
	 * public LoginResponse(String message, String token, Long id) { this(message,
	 * token,null, id,null); }
	 */
	// kept for backward compatibility in case anything else calls these
	public LoginResponse(String Message, String token, String userType, Long id) {
		this(Message, token, userType, id, null);
	}

	public LoginResponse(String message, String token, Long id) {
		this(message, token, null, id, null);
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
