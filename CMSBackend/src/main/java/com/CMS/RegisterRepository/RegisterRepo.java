package com.CMS.RegisterRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.CMS.PaitentDashboard.AppointmentEntity;
import com.CMS.Register.entity.Register;

public interface RegisterRepo extends JpaRepository<Register,Integer>{
	@Query("select r from Register r where r.name = :name")
	Register findByName(@Param("name") String name);

	//Register findByEmail(String email);
	boolean existsByEmail(String email);
	 Register findByContact(String contact);
	Optional<Register> findByEmail(String email);
	
	long countByUserType(Register.UserType userType);



}
