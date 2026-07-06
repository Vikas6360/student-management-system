package com.student.management.service.impl;

import com.student.management.dto.StudentDto;
import com.student.management.entity.Student;
import com.student.management.exception.ResourceNotFoundException;
import com.student.management.repository.StudentRepository;
import com.student.management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public StudentDto createStudent(StudentDto studentDto) {
        Student student = mapToEntity(studentDto);
        Student newStudent = studentRepository.save(student);
        return mapToDto(newStudent);
    }

    @Override
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Student", "id", id));
        return mapToDto(student);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public StudentDto updateStudent(StudentDto studentDto, Long id) {
        Student student = studentRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Student", "id", id));

        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPhoneNumber(studentDto.getPhoneNumber());
        student.setGender(studentDto.getGender());
        student.setDepartment(studentDto.getDepartment());
        student.setSemester(studentDto.getSemester());
        student.setCgpa(studentDto.getCgpa());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        student.setAddress(studentDto.getAddress());

        Student updatedStudent = studentRepository.save(student);
        return mapToDto(updatedStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Student", "id", id));
        studentRepository.delete(student);
    }

    private StudentDto mapToDto(Student student) {
        StudentDto studentDto = new StudentDto();
        studentDto.setId(student.getId());
        studentDto.setFirstName(student.getFirstName());
        studentDto.setLastName(student.getLastName());
        studentDto.setEmail(student.getEmail());
        studentDto.setPhoneNumber(student.getPhoneNumber());
        studentDto.setGender(student.getGender());
        studentDto.setDepartment(student.getDepartment());
        studentDto.setSemester(student.getSemester());
        studentDto.setCgpa(student.getCgpa());
        studentDto.setDateOfBirth(student.getDateOfBirth());
        studentDto.setAddress(student.getAddress());
        studentDto.setCreatedAt(student.getCreatedAt());
        studentDto.setUpdatedAt(student.getUpdatedAt());
        return studentDto;
    }

    private Student mapToEntity(StudentDto studentDto) {
        Student student = new Student();
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPhoneNumber(studentDto.getPhoneNumber());
        student.setGender(studentDto.getGender());
        student.setDepartment(studentDto.getDepartment());
        student.setSemester(studentDto.getSemester());
        student.setCgpa(studentDto.getCgpa());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        student.setAddress(studentDto.getAddress());
        return student;
    }
}
