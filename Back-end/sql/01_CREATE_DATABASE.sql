-- ============================================
-- Script de création de la base de données D-Pression
-- À exécuter dans SQL Server Management Studio (SSMS)
-- ============================================

-- 1. Créer la base de données
USE master;
GO

-- Supprimer la base si elle existe déjà (optionnel - décommenter si nécessaire)
-- IF EXISTS (SELECT name FROM sys.databases WHERE name = N'dpression_db')
-- BEGIN
--     ALTER DATABASE dpression_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--     DROP DATABASE dpression_db;
-- END
-- GO

-- Créer la nouvelle base de données
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'dpression_db')
BEGIN
    CREATE DATABASE dpression_db
    COLLATE French_CI_AS;
END
GO

USE dpression_db;
GO

PRINT 'Base de données dpression_db créée avec succès !';
GO
