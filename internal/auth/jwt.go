package auth

import (
	"QTDA/internal/user/dto"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var jwtKey = []byte("6fKyb2bWe3P0RrqGoD8HYdnXTWRSUubtRzNoVXucjK4=") // 🔐 nên lưu trong biến môi trường

func GenerateJWT(user dto.User) (string, error) {
	// Định nghĩa claims
	claims := jwt.MapClaims{
		"id" : uuid.New().String(),
		"sub": user.UserID,
		"exp":     time.Now().Add(time.Hour * 1).Unix(), // Token hết hạn sau 1 giờ
		"scope": user.Role,
	}

	// Tạo token với claims và thuật toán ký
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Ký token và tạo chuỗi token
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func VerifyJWT(tokenStr string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// Kiểm tra thuật toán ký có khớp không
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid token: %v", err)
	}

	// Trích xuất claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("could not parse claims")
	}

	return claims, nil
}
