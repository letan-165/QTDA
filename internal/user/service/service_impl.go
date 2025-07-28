package service

import (
	"QTDA/internal/user/dto"
	"QTDA/internal/user/repository"
	"fmt"

	"github.com/jinzhu/copier"
)

type userServiceImpl struct {
	repo repository.UserRepository
}

func NewUserService() UserService {
	return &userServiceImpl{
		repo: repository.NewUserRepository(),
	}
}

func (s *userServiceImpl) ViewProfile(id string) (dto.Student, error) {
	return s.repo.FindByID(id)
}

func (s *userServiceImpl) EditProfile(request dto.Student) (dto.Student, error) {
	return s.repo.SaveStudent(request)
}

func (s *userServiceImpl) SignUps(request dto.SignUpsRequest) ([]dto.User, error) {
	var users []dto.User

	for _, r := range request.Users {
		var user dto.User
		if err := copier.Copy(&user, &r); err != nil {
			return nil, fmt.Errorf("lỗi copy user: %w", err)
		}

		savedUser, err := s.repo.SaveUser(user)
		userID := savedUser.UserID
		if err != nil {
			return nil, fmt.Errorf("lỗi SaveUser: %w", err)
		}

		if r.Role == "STUDENT" {
			var student dto.Student
			if err := copier.Copy(&student, &r); err != nil {
				return nil, fmt.Errorf("lỗi copy student: %w", err)
			}
			student.StudentID = userID
			_, err := s.repo.SaveStudent(student)
			if err != nil {
				return nil, fmt.Errorf("lỗi SaveStudent: %w", err)
			}
		} else {
			var employee dto.Employee
			if err := copier.Copy(&employee, &r); err != nil {
				return nil, fmt.Errorf("lỗi copy employee: %w", err)
			}
			employee.EmployeeID = userID
			_, err := s.repo.SaveEmployee(employee)
			if err != nil {
				return nil, fmt.Errorf("lỗi SaveEmployee: %w", err)
			}
		} 

		users = append(users, savedUser)
	}

	return users, nil
}


