USE master;
GO

CREATE DATABASE IdentityProviderDB;
GO

--Create Users table
USE IdentityProviderDB;
CREATE TABLE [dbo].[Users](
    [Username] [varchar](100) UNIQUE NOT NULL,
    [Email] [varchar](100) UNIQUE NOT NULL,
    [Password] [varchar](100) NOT NULL,
);
GO

--Primary key constraint
USE IdentityProviderDB;
ALTER TABLE dbo.Users
ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Username] ASC);
GO