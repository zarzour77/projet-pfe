-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: trade_for_talent
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avis`
--

DROP TABLE IF EXISTS `avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avis` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `commentaire` varchar(255) DEFAULT NULL,
  `date_avis` datetime(6) DEFAULT NULL,
  `auteur_id` bigint DEFAULT NULL,
  `cible_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhq91kyjaiovsjy9wnqyx00tec` (`auteur_id`),
  KEY `FKic7xufhv9e8yu1uy2f815gfrw` (`cible_id`),
  CONSTRAINT `FKhq91kyjaiovsjy9wnqyx00tec` FOREIGN KEY (`auteur_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKic7xufhv9e8yu1uy2f815gfrw` FOREIGN KEY (`cible_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKjmrx0tnli1u8vvg0hk0kuxr77` FOREIGN KEY (`cible_id`) REFERENCES `utilisateur` (`id`),
  CONSTRAINT `FKviu2gwq6fjys23nns6hg69kb` FOREIGN KEY (`auteur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avis`
--

LOCK TABLES `avis` WRITE;
/*!40000 ALTER TABLE `avis` DISABLE KEYS */;
/*!40000 ALTER TABLE `avis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence`
--

DROP TABLE IF EXISTS `competence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence`
--

LOCK TABLES `competence` WRITE;
/*!40000 ALTER TABLE `competence` DISABLE KEYS */;
/*!40000 ALTER TABLE `competence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultant`
--

DROP TABLE IF EXISTS `consultant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultant` (
  `portfolio` varchar(255) DEFAULT NULL,
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK8t4gid80ajtdoyy0po1n425ip` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`),
  CONSTRAINT `FKg2jar63v7f4g0he9kfwes2afr` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultant`
--

LOCK TABLES `consultant` WRITE;
/*!40000 ALTER TABLE `consultant` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entreprise`
--

DROP TABLE IF EXISTS `entreprise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entreprise` (
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK46hdktooee6n49qcvc0031ewd` FOREIGN KEY (`id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKjfifweqr1or31v0f7up8knlhq` FOREIGN KEY (`id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entreprise`
--

LOCK TABLES `entreprise` WRITE;
/*!40000 ALTER TABLE `entreprise` DISABLE KEYS */;
/*!40000 ALTER TABLE `entreprise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mission`
--

DROP TABLE IF EXISTS `mission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mission` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `budget` double DEFAULT NULL,
  `deadline` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `entreprise_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKh3jmhrsp23heeo21beul0bh71` (`entreprise_id`),
  CONSTRAINT `FKh3jmhrsp23heeo21beul0bh71` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprise` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mission`
--

LOCK TABLES `mission` WRITE;
/*!40000 ALTER TABLE `mission` DISABLE KEYS */;
/*!40000 ALTER TABLE `mission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mission_competences_requises`
--

DROP TABLE IF EXISTS `mission_competences_requises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mission_competences_requises` (
  `missions_id` bigint NOT NULL,
  `competences_requises_id` bigint NOT NULL,
  KEY `FK9cu1oahk8dd3o1y4xp5c4okah` (`competences_requises_id`),
  KEY `FKfrocpmw9opxyilur0sfjoop6t` (`missions_id`),
  CONSTRAINT `FK9cu1oahk8dd3o1y4xp5c4okah` FOREIGN KEY (`competences_requises_id`) REFERENCES `competence` (`id`),
  CONSTRAINT `FKfrocpmw9opxyilur0sfjoop6t` FOREIGN KEY (`missions_id`) REFERENCES `mission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mission_competences_requises`
--

LOCK TABLES `mission_competences_requises` WRITE;
/*!40000 ALTER TABLE `mission_competences_requises` DISABLE KEYS */;
/*!40000 ALTER TABLE `mission_competences_requises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `est_lu` bit(1) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `utilisateur_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqinbae6rk1lmy8j4ogr23vfrf` (`utilisateur_id`),
  CONSTRAINT `FK1e85ddpswdf3uq1oaklnjiucf` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  CONSTRAINT `FKqinbae6rk1lmy8j4ogr23vfrf` FOREIGN KEY (`utilisateur_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposition`
--

DROP TABLE IF EXISTS `proposition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposition` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `durée_estimé` datetime(6) DEFAULT NULL,
  `montant` double DEFAULT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `consultant_id` bigint DEFAULT NULL,
  `mission_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdw1kbp0qslhdar1j98jcnw02j` (`consultant_id`),
  KEY `FKb5y66q4i3jumfgfgd9pidl57d` (`mission_id`),
  CONSTRAINT `FKb5y66q4i3jumfgfgd9pidl57d` FOREIGN KEY (`mission_id`) REFERENCES `mission` (`id`),
  CONSTRAINT `FKdw1kbp0qslhdar1j98jcnw02j` FOREIGN KEY (`consultant_id`) REFERENCES `consultant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposition`
--

LOCK TABLES `proposition` WRITE;
/*!40000 ALTER TABLE `proposition` DISABLE KEYS */;
/*!40000 ALTER TABLE `proposition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `montant` double DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `destinataire_id` bigint DEFAULT NULL,
  `debiteur_id` bigint DEFAULT NULL,
  `mission_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK93467qotuqbsk68d79kjvlc61` (`mission_id`),
  KEY `FKmxx2639rqikwjf2qqv840g4dj` (`destinataire_id`),
  KEY `FKfk94ks9kkrhyqi04hnh3amcx6` (`debiteur_id`),
  CONSTRAINT `FK93467qotuqbsk68d79kjvlc61` FOREIGN KEY (`mission_id`) REFERENCES `mission` (`id`),
  CONSTRAINT `FKa2y6ln8f1xyaj8bhv5hf0exiy` FOREIGN KEY (`debiteur_id`) REFERENCES `utilisateur` (`id`),
  CONSTRAINT `FKfk94ks9kkrhyqi04hnh3amcx6` FOREIGN KEY (`debiteur_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKmxx2639rqikwjf2qqv840g4dj` FOREIGN KEY (`destinataire_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKxgt3as11egano89aa7gvwlnf` FOREIGN KEY (`destinataire_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `adresse` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_competences`
--

DROP TABLE IF EXISTS `user_competences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_competences` (
  `users_id` bigint NOT NULL,
  `competences_id` bigint NOT NULL,
  KEY `FK9p0nbjjt3jr0pnsksgvp6klr7` (`competences_id`),
  KEY `FK16emqehxqnma3yktaj458hff5` (`users_id`),
  CONSTRAINT `FK16emqehxqnma3yktaj458hff5` FOREIGN KEY (`users_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK9p0nbjjt3jr0pnsksgvp6klr7` FOREIGN KEY (`competences_id`) REFERENCES `competence` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_competences`
--

LOCK TABLES `user_competences` WRITE;
/*!40000 ALTER TABLE `user_competences` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_competences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `adresse` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur_competences`
--

DROP TABLE IF EXISTS `utilisateur_competences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur_competences` (
  `utilisateurs_id` bigint NOT NULL,
  `competences_id` bigint NOT NULL,
  KEY `FK9fcmnijkcd498dmddfxujvdtg` (`competences_id`),
  KEY `FKd1f9fq59nralyblxgtjmk6i8d` (`utilisateurs_id`),
  CONSTRAINT `FK9fcmnijkcd498dmddfxujvdtg` FOREIGN KEY (`competences_id`) REFERENCES `competence` (`id`),
  CONSTRAINT `FKd1f9fq59nralyblxgtjmk6i8d` FOREIGN KEY (`utilisateurs_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur_competences`
--

LOCK TABLES `utilisateur_competences` WRITE;
/*!40000 ALTER TABLE `utilisateur_competences` DISABLE KEYS */;
/*!40000 ALTER TABLE `utilisateur_competences` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-28 10:10:47
