package com.CMS.RegisterRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.CMS.Register.entity.Register;

public interface RegisterRepo extends JpaRepository<Register,Integer>{
	@Query("select r from Register r where r.name = :name")
	Register findByName(@Param("name") String name);

	Register findByEmail(String email);
  
	 Register findByContact(String contact);


}
