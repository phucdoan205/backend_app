using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackendApp.Models;
using Microsoft.IdentityModel.Tokens;

namespace BackendApp.Services
{
    public static class JwtService
    {
        public static string CreateToken(User user, string key, string issuer, string audience)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                
                // 1. QUAN TRỌNG: Lấy Role trực tiếp từ User được truyền vào (Không được hardcode!)
                new Claim("role", user.Role), 

                // 2. QUAN TRỌNG: Thêm ID ngẫu nhiên để Token luôn khác nhau mỗi lần login
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) 
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(24), // Thời gian hết hạn
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}