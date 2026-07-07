package com.CMS.Config;

import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	@Autowired
	RegisterRepo regRepo;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

	    Register user = regRepo.findByEmail(email)
	            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

	    return new org.springframework.security.core.userdetails.User(
	            user.getEmail(),
	            user.getPassword(),
	            Arrays.asList(
	                    new SimpleGrantedAuthority(
	                            "ROLE_" + user.getUserType().name().toUpperCase()
	                    )
	            )
	    );
	}
	 
	
}

//return new User(user.getEmail(), user.getPassword(), new ArrayList<>());
