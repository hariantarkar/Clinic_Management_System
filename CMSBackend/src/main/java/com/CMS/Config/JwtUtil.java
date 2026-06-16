package com.CMS.Config;

import java.sql.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private String ScecerKey = "HariAntarkar@1234HariAntarkar@1234HariAntarkar@1234";

	private java.security.Key key = Keys.hmacShaKeyFor(ScecerKey.getBytes());

	public String generateToken(String username,String role) {
		System.out.println("Generating token for = " + username);
		return Jwts.builder()
				.setSubject(username)
				.claim("role", role)
				.setIssuedAt(new java.util.Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)).signWith(key).compact();
	}
	public String getRole(String token) {

	    String newToken = token.substring(7);

	    Claims claims = Jwts.parserBuilder()
	            .setSigningKey(key)
	            .build()
	            .parseClaimsJws(newToken)
	            .getBody();

	    return claims.get("role", String.class);
	}

	public String verifyToken(String token) {

		if (token == null || !token.startsWith("Bearer ")) {
			throw new RuntimeException("Invalid token");
		}

		String newToken = token.substring(7);

		try {

			Claims claim = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(newToken).getBody();

			System.out.println("Username = " + claim.getSubject());

			return claim.getSubject();

		} catch (io.jsonwebtoken.ExpiredJwtException e) {

			throw new RuntimeException("Token expired");

		} catch (Exception e) {

			throw new RuntimeException("Invalid token");

		}
	}
	
}
