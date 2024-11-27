package com.fantastik.fantastik.repository;

import com.fantastik.fantastik.model.Users;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {

    // findby username optional
    Optional<Users> findByUsername(String username);

}