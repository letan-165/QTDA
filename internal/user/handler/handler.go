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
	role := c.Param("role")

	student, err := h.userService.ViewProfile(id, role )
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

func (h *UserHandler) LoginHandler(c *gin.Context) {
    var req dto.LoginRequest
    log.Println("LoginHandler")

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
        return
    }

    token, err := h.userService.Login(req)
    if err != nil {
        log.Println("Lỗi đăng nhập:", err)
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *UserHandler) IntrospectHandler(c *gin.Context) {
	// Bước 1: Parse JSON body
	var req struct {
		Token string `json:"token"`
	}

    log.Println("IntrospectHandler")
	if err := c.ShouldBindJSON(&req); err != nil || req.Token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token is required in request body"})
		return
	}

	// Bước 2: Gọi service
	valid, err := h.userService.Introspect(req.Token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"valid": false, "error": err.Error()})
		return
	}

	// Bước 3: Trả kết quả
	c.JSON(http.StatusOK, gin.H{"valid": valid})
}
