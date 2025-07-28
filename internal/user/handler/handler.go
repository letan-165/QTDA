package handler

import (
	"QTDA/internal/user/dto"
	"QTDA/internal/user/service"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService service.UserService
}

func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}


func (h *UserHandler) ViewProfileHandler(c *gin.Context) {
	id := c.Param("userID")

	student, err := h.userService.ViewProfile(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Không tìm thấy người dùng",
		})
		return
	}

	c.JSON(http.StatusOK, student)
}

func (h *UserHandler) SignUpsHandler(c *gin.Context) {
	var req dto.SignUpsRequest
	log.Println("SignUpsHandler")
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	users, err := h.userService.SignUps(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Đăng ký thành công",
		"data":    users,
	})
}
