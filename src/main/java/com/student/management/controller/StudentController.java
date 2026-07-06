package com.student.management.controller;

import com.student.management.dto.StudentDto;
import com.student.management.response.ApiResponse;
import com.student.management.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Student Controller", description = "CRUD APIs for Students")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    @Operation(summary = "Create Student REST API", description = "REST API to save student to database")
    public ResponseEntity<ApiResponse<StudentDto>> createStudent(@Valid @RequestBody StudentDto studentDto) {
        StudentDto savedStudent = studentService.createStudent(studentDto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Student created successfully", savedStudent), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Student REST API", description = "REST API to get student by ID")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable("id") Long studentId) {
        StudentDto studentDto = studentService.getStudentById(studentId);
        return new ResponseEntity<>(new ApiResponse<>(true, "Student fetched successfully", studentDto), HttpStatus.OK);
    }

    @GetMapping
    @Operation(summary = "Get All Students REST API", description = "REST API to get all students")
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents() {
        List<StudentDto> students = studentService.getAllStudents();
        return new ResponseEntity<>(new ApiResponse<>(true, "Students fetched successfully", students), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Student REST API", description = "REST API to update student information")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(
            @Valid @RequestBody StudentDto studentDto,
            @PathVariable("id") Long studentId) {
        StudentDto updatedStudent = studentService.updateStudent(studentDto, studentId);
        return new ResponseEntity<>(new ApiResponse<>(true, "Student updated successfully", updatedStudent), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Student REST API", description = "REST API to delete student by ID")
    public ResponseEntity<ApiResponse<String>> deleteStudent(@PathVariable("id") Long studentId) {
        studentService.deleteStudent(studentId);
        return new ResponseEntity<>(new ApiResponse<>(true, "Student deleted successfully", null), HttpStatus.OK);
    }
}
