package com.CMS.jwtVerify;

import java.io.IOException;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.CMS.Config.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.userdetails.UserDetails;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private UserDetailsService userDetailsService;

	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String path = request.getServletPath();

		// Skip login and register APIs
		if (path.equals("/auth/login")
		        || path.equals("/auth/reg")) {

		    filterChain.doFilter(request, response);
		    return;
		}

		String authHeader = request.getHeader("Authorization");

		String username = null;

		try {

			System.out.println("Path = " + path);
			System.out.println("Authorization Header = " + authHeader);

			if (authHeader != null && authHeader.startsWith("Bearer ")) {

				username = jwtUtil.verifyToken(authHeader);

				System.out.println("Username from token = " + username);
			}

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

				UserDetails userDetails = userDetailsService.loadUserByUsername(username);

				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
						null, userDetails.getAuthorities());

				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(authToken);
				 System.out.println(
				            "Authorities = "
				            + SecurityContextHolder.getContext()
				                    .getAuthentication()
				                    .getAuthorities()
				    );
			}

		} catch (Exception e) {

			System.out.println("JWT Error : " + e.getMessage());

			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write(e.getMessage());

			return;
		}

		filterChain.doFilter(request, response);
	}
}
