package com.fantastik.fantastik.repository;

import com.fantastik.fantastik.model.Tasks;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TasksRepository extends JpaRepository<Tasks, Long> {
}
