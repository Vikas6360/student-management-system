package com.student.management.service;

import com.student.management.dto.StudentDto;
import java.util.List;

public interface StudentService {
    StudentDto createStudent(StudentDto studentDto);
    StudentDto getStudentById(Long id);
    List<StudentDto> getAllStudents();
    StudentDto updateStudent(StudentDto studentDto, Long id);
    void deleteStudent(Long id);
}
