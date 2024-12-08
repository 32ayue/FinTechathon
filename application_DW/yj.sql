/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80028
 Source Host           : localhost:3306
 Source Schema         : yj

 Target Server Type    : MySQL
 Target Server Version : 80028
 File Encoding         : 65001

 Date: 31/12/2023 09:25:50
*/

use mydatabase;

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `ID` bigint NOT NULL,
  `phoneNumber` bigint NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (10001, 18900000000, '管理员', '123');
INSERT INTO `admin` VALUES (10002, 18900001111, '管理员1', '123');

-- ----------------------------
-- Table structure for click
-- ----------------------------
DROP TABLE IF EXISTS `click`;
CREATE TABLE `click`  (
  `ID` bigint NOT NULL,
  `stuID` bigint NULL DEFAULT NULL,
  `actID` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of click
-- ----------------------------
INSERT INTO `click` VALUES (20001, 40001, 80001);
INSERT INTO `click` VALUES (20002, 40001, 80002);
INSERT INTO `click` VALUES (20003, 40002, 80001);
INSERT INTO `click` VALUES (20004, 40002, 80001);
INSERT INTO `click` VALUES (20005, 40001, 80001);
INSERT INTO `click` VALUES (20006, 40001, 80001);
INSERT INTO `click` VALUES (20007, 40001, 80001);
INSERT INTO `click` VALUES (20008, 40001, 80001);
INSERT INTO `click` VALUES (20009, 40001, 80005);
INSERT INTO `click` VALUES (20010, 40001, 80001);
INSERT INTO `click` VALUES (20011, 40001, 80007);
INSERT INTO `click` VALUES (20012, 20001, 80001);
INSERT INTO `click` VALUES (20013, 40001, 80001);
INSERT INTO `click` VALUES (20014, 40001, 80008);
INSERT INTO `click` VALUES (20015, 40001, 80008);
INSERT INTO `click` VALUES (20016, 40001, 80008);
INSERT INTO `click` VALUES (20017, 40001, 80008);
INSERT INTO `click` VALUES (20018, 40001, 80008);
INSERT INTO `click` VALUES (20019, 40001, 80008);
INSERT INTO `click` VALUES (20020, 40001, 80008);
INSERT INTO `click` VALUES (20021, 40001, 80008);
INSERT INTO `click` VALUES (20022, 40001, 80008);
INSERT INTO `click` VALUES (20023, 40001, 80008);
INSERT INTO `click` VALUES (20024, 40001, 80004);
INSERT INTO `click` VALUES (20025, 40001, 80004);
INSERT INTO `click` VALUES (20026, 40001, 80004);
INSERT INTO `click` VALUES (20027, 40001, 80004);
INSERT INTO `click` VALUES (20028, 40001, 80004);
INSERT INTO `click` VALUES (20029, 40001, 80004);
INSERT INTO `click` VALUES (20030, 40001, 80004);
INSERT INTO `click` VALUES (20031, 40001, 80004);
INSERT INTO `click` VALUES (20032, 40001, 80004);
INSERT INTO `click` VALUES (20033, 40001, 80004);
INSERT INTO `click` VALUES (20034, 40001, 80004);
INSERT INTO `click` VALUES (20035, 40001, 80008);
INSERT INTO `click` VALUES (20036, 40001, 80008);
INSERT INTO `click` VALUES (20037, 40001, 80008);
INSERT INTO `click` VALUES (20038, 40001, 80008);
INSERT INTO `click` VALUES (20039, 40001, 80007);
INSERT INTO `click` VALUES (20040, 40001, 80007);
INSERT INTO `click` VALUES (20041, 40001, 80006);
INSERT INTO `click` VALUES (20042, 40001, 80006);
INSERT INTO `click` VALUES (20043, 40001, 80006);
INSERT INTO `click` VALUES (20044, 40001, 80006);
INSERT INTO `click` VALUES (20045, 40001, 80006);
INSERT INTO `click` VALUES (20046, 40001, 80006);
INSERT INTO `click` VALUES (20047, 40001, 80006);
INSERT INTO `click` VALUES (20048, 40001, 80006);
INSERT INTO `click` VALUES (20049, 40001, 80006);
INSERT INTO `click` VALUES (20050, 40001, 80006);
INSERT INTO `click` VALUES (20051, 40001, 80006);
INSERT INTO `click` VALUES (20052, 40001, 80006);
INSERT INTO `click` VALUES (20053, 40001, 80005);
INSERT INTO `click` VALUES (20054, 40001, 80001);
INSERT INTO `click` VALUES (20055, 40001, 80001);
INSERT INTO `click` VALUES (20056, 40001, 80005);
INSERT INTO `click` VALUES (20057, 40001, 80001);
INSERT INTO `click` VALUES (20058, 40001, 80001);
INSERT INTO `click` VALUES (20059, 40001, 80001);
INSERT INTO `click` VALUES (20060, 40001, 80001);
INSERT INTO `click` VALUES (20061, 40001, 80004);
INSERT INTO `click` VALUES (20062, 40001, 80002);
INSERT INTO `click` VALUES (20063, 40001, 80008);
INSERT INTO `click` VALUES (20064, 40001, 80002);
INSERT INTO `click` VALUES (20065, 40001, 80002);
INSERT INTO `click` VALUES (20066, 40001, 80002);
INSERT INTO `click` VALUES (20067, 40001, 80002);
INSERT INTO `click` VALUES (20068, 40001, 80008);
INSERT INTO `click` VALUES (20069, 40001, 80006);
INSERT INTO `click` VALUES (20070, 40001, 80002);
INSERT INTO `click` VALUES (20071, 40001, 80008);
INSERT INTO `click` VALUES (20072, 40001, 80001);
INSERT INTO `click` VALUES (20073, 20001, 80001);
INSERT INTO `click` VALUES (20074, 40001, 80001);
INSERT INTO `click` VALUES (20075, 40001, 80001);
INSERT INTO `click` VALUES (20076, 40001, 80005);
INSERT INTO `click` VALUES (20077, 40001, 80006);
INSERT INTO `click` VALUES (20078, 40001, 80002);
INSERT INTO `click` VALUES (20079, 40001, 80005);
INSERT INTO `click` VALUES (20080, 40001, 80001);
INSERT INTO `click` VALUES (20081, 40001, 80005);
INSERT INTO `click` VALUES (20082, 40001, 80001);
INSERT INTO `click` VALUES (20083, 40001, 80001);
INSERT INTO `click` VALUES (20084, 40001, 80001);
INSERT INTO `click` VALUES (20085, 40001, 80001);
INSERT INTO `click` VALUES (20086, 40001, 80007);
INSERT INTO `click` VALUES (20087, 40001, 80001);
INSERT INTO `click` VALUES (20088, 40001, 80004);
INSERT INTO `click` VALUES (20089, 40001, 80008);
INSERT INTO `click` VALUES (20090, 40001, 80008);
INSERT INTO `click` VALUES (20091, 20001, 80001);
INSERT INTO `click` VALUES (20092, 20001, 80007);
INSERT INTO `click` VALUES (20093, 40001, 80001);
INSERT INTO `click` VALUES (20094, 40001, 80005);
INSERT INTO `click` VALUES (20095, 40001, 80001);
INSERT INTO `click` VALUES (20096, 40001, 80001);
INSERT INTO `click` VALUES (20097, 40001, 80001);
INSERT INTO `click` VALUES (20098, 40001, 80001);
INSERT INTO `click` VALUES (20099, 40001, 80001);
INSERT INTO `click` VALUES (20100, 40001, 80001);
INSERT INTO `click` VALUES (20101, 40001, 80005);
INSERT INTO `click` VALUES (20102, 40001, 80007);
INSERT INTO `click` VALUES (20103, 40001, 80004);
INSERT INTO `click` VALUES (20104, 40001, 80006);
INSERT INTO `click` VALUES (20105, 40001, 80002);
INSERT INTO `click` VALUES (20106, 40001, 80008);
INSERT INTO `click` VALUES (20107, 40001, 80001);
INSERT INTO `click` VALUES (20108, 40001, 80001);
INSERT INTO `click` VALUES (20109, 40001, 80001);
INSERT INTO `click` VALUES (20110, 40001, 80001);
INSERT INTO `click` VALUES (20111, 40001, 80001);
INSERT INTO `click` VALUES (20112, 40001, 80001);
INSERT INTO `click` VALUES (20113, 40001, 80005);
INSERT INTO `click` VALUES (20114, 40001, 80007);
INSERT INTO `click` VALUES (20115, 40001, 80001);
INSERT INTO `click` VALUES (20116, 40001, 80007);
INSERT INTO `click` VALUES (20117, 40001, 80006);
INSERT INTO `click` VALUES (20118, 40001, 80001);
INSERT INTO `click` VALUES (20119, 40001, 80005);
INSERT INTO `click` VALUES (20120, 40001, 80001);
INSERT INTO `click` VALUES (20121, 40001, 80001);
INSERT INTO `click` VALUES (20122, 40001, 80001);
INSERT INTO `click` VALUES (20123, 40001, 80004);
INSERT INTO `click` VALUES (20124, 40001, 80001);
INSERT INTO `click` VALUES (20125, 40001, 80001);
INSERT INTO `click` VALUES (20126, 40001, 80001);
INSERT INTO `click` VALUES (20127, 40001, 80001);
INSERT INTO `click` VALUES (20128, 40001, 80001);
INSERT INTO `click` VALUES (20129, 40001, 80001);
INSERT INTO `click` VALUES (20130, 40001, 80001);

-- ----------------------------
-- Table structure for club
-- ----------------------------
DROP TABLE IF EXISTS `club`;
CREATE TABLE `club`  (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `phoneNumber` bigint NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `collegeID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `leader` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `teaID` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20007 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of club
-- ----------------------------
INSERT INTO `club` VALUES (20001, 18958320001, '1', 'jerry', '1', 'jerry', '小徐', 30001);
INSERT INTO `club` VALUES (20002, 18920381234, '123', 'leo', '1', '科创部', '小陈', 30001);
INSERT INTO `club` VALUES (20003, 18920381235, '123', 'mike', '1', '留学协会', '小黄', 30001);
INSERT INTO `club` VALUES (20004, 18920381236, '123', 'lily', '1', '人工智能协会', '小黑', 30001);
INSERT INTO `club` VALUES (20005, 18920381237, '123', 'john', '1', '青协', '小张', 30001);
INSERT INTO `club` VALUES (20006, 18920381238, '123', 'herry', '1', '文艺部', '小璐', 30001);
INSERT INTO `club` VALUES (20007, 18920385566, '123', 'oribit', '2', '嘿嘿嘿', '小小', 30002);

-- ----------------------------
-- Table structure for college
-- ----------------------------
DROP TABLE IF EXISTS `college`;
CREATE TABLE `college`  (
  `ID` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `leader` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of college
-- ----------------------------
INSERT INTO `college` VALUES (1, '信息管理与人工智能', '小张');
INSERT INTO `college` VALUES (2, '工商管理', '小王');
INSERT INTO `college` VALUES (3, '数据科学', '小李');
INSERT INTO `college` VALUES (4, '会计', '小袁');

-- ----------------------------
-- Table structure for complaint
-- ----------------------------
DROP TABLE IF EXISTS `complaint`;
CREATE TABLE `complaint`  (
  `ID` bigint NOT NULL,
  `stuID` bigint NULL DEFAULT NULL,
  `actID` bigint NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` bigint NULL DEFAULT NULL,
  `time` date NULL DEFAULT NULL,
  `scoreID_pre` bigint NULL DEFAULT NULL,
  `scoreID_new` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of complaint
-- ----------------------------
INSERT INTO `complaint` VALUES (20000, 40001, 80001, '报名有误', 0, '2022-04-23', 80000, 80001);
INSERT INTO `complaint` VALUES (20001, 40001, 80001, '报名时点错了，不好意思，烦请老师通过', 0, '2022-05-08', 80001, 80000);

-- ----------------------------
-- Table structure for detection
-- ----------------------------
DROP TABLE IF EXISTS `detection`;
CREATE TABLE `detection`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `website` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `result` int NULL DEFAULT NULL,
  `date` date NULL DEFAULT NULL,
  `userId` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 109081123 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of detection
-- ----------------------------
INSERT INTO `detection` VALUES (31111, 'www.baidu.com', 0, '2023-02-26', 20005);
INSERT INTO `detection` VALUES (109081109, 'www.baidu.com.com', 1, '2023-02-26', 20001);
INSERT INTO `detection` VALUES (109081110, 'ww.wrare.eru.cn', 1, '2023-02-26', 20001);
INSERT INTO `detection` VALUES (109081111, 'www.bilibili', 0, '2023-03-28', 20001);
INSERT INTO `detection` VALUES (109081121, '94392', 1, '2023-04-07', 20001);
INSERT INTO `detection` VALUES (109081122, 'ww.cascasdas', 1, '2023-04-07', 20001);
INSERT INTO `detection` VALUES (109081123, 'ww.asfdawf.asd', 1, '2023-08-05', 20001);

-- ----------------------------
-- Table structure for enroll
-- ----------------------------
DROP TABLE IF EXISTS `enroll`;
CREATE TABLE `enroll`  (
  `ID` bigint NOT NULL,
  `stuID` bigint NULL DEFAULT NULL,
  `actID` bigint NULL DEFAULT NULL,
  `enrollTime` date NULL DEFAULT NULL,
  `success` bigint NULL DEFAULT NULL,
  `signIN` bigint NULL DEFAULT NULL COMMENT '签到',
  `signOUT` bigint NULL DEFAULT NULL COMMENT '签退',
  `scoreID` bigint NULL DEFAULT NULL COMMENT '角色',
  `quality` bigint NULL DEFAULT NULL COMMENT '活动评分',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of enroll
-- ----------------------------
INSERT INTO `enroll` VALUES (0, NULL, 80010, NULL, NULL, NULL, NULL, 80026, NULL);
INSERT INTO `enroll` VALUES (20000, 40002, 80001, '2022-02-22', NULL, 1, 1, 80001, NULL);
INSERT INTO `enroll` VALUES (20001, 40003, 80002, '2022-01-22', NULL, 0, 0, 80003, NULL);
INSERT INTO `enroll` VALUES (20002, 40002, 80001, '2022-04-22', NULL, 1, 1, 80001, NULL);
INSERT INTO `enroll` VALUES (20005, 40001, 80001, '2022-04-28', NULL, 1, 1, 80001, 3);
INSERT INTO `enroll` VALUES (20006, 40001, 80005, '2022-04-28', NULL, NULL, NULL, 80006, NULL);
INSERT INTO `enroll` VALUES (20008, 180110910215, 80001, '2022-03-22', NULL, 1, 1, 80000, NULL);
INSERT INTO `enroll` VALUES (20009, 180110910218, 80001, '2022-03-22', NULL, 1, 1, 80000, NULL);
INSERT INTO `enroll` VALUES (20010, 180110910219, 80001, '2022-03-22', NULL, 1, 1, 80000, NULL);
INSERT INTO `enroll` VALUES (20011, 180110910221, 80001, '2022-03-22', NULL, 1, 1, 80000, NULL);
INSERT INTO `enroll` VALUES (20012, 180110910225, 80001, '2022-03-22', NULL, 1, 1, 80000, NULL);
INSERT INTO `enroll` VALUES (20013, 180110910234, 80001, '2022-05-22', NULL, 1, 1, 80000, NULL);
INSERT INTO `enroll` VALUES (20014, 180110910235, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20015, 180110910302, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20016, 180110910305, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20017, 180110910317, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20018, 180110910329, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20019, 180110910332, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20020, 180110910334, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20021, 180110910338, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20022, 180110910403, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20023, 180110910410, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20024, 180110910411, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20025, 180110910414, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20026, 180110910436, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20027, 180110910527, 80001, '2022-04-22', NULL, NULL, NULL, 80000, NULL);
INSERT INTO `enroll` VALUES (20029, 180110910215, 80014, '2022-05-08', NULL, 1, 1, 80033, NULL);
INSERT INTO `enroll` VALUES (20030, 180110910218, 80014, '2022-05-08', NULL, 1, 1, 80033, NULL);
INSERT INTO `enroll` VALUES (20031, 180110910219, 80014, '2022-05-08', NULL, 1, 1, 80033, NULL);

-- ----------------------------
-- Table structure for feedback
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback`  (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `website` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fe_T` date NULL DEFAULT NULL,
  `re_T` date NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `auditStatus` bigint NULL DEFAULT NULL,
  `userId` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of feedback
-- ----------------------------
INSERT INTO `feedback` VALUES (10, 'www.baidu.com.com', '2023-02-26', '2023-02-28', '大苏打实打实', 1, 20001);
INSERT INTO `feedback` VALUES (11, 'waewfwef', '2023-02-27', '2023-02-28', 'dasfewaf', 1, 20004);
INSERT INTO `feedback` VALUES (12, 'fdesgfwegferr', '2023-02-10', '2023-02-18', '131eaefewge', 1, 20003);
INSERT INTO `feedback` VALUES (13, 'www.wodeshijie.com', '2023-02-28', NULL, '我被这个网站骗了100，大家不要上当', 1, 20003);
INSERT INTO `feedback` VALUES (14, 'ww.cascasdas', '2023-04-07', NULL, 'wawdwad', 1, 20001);
INSERT INTO `feedback` VALUES (15, 'ww.cascasdas', '2023-04-07', NULL, '这个网站是正常的\n', 0, 20001);
INSERT INTO `feedback` VALUES (16, 'www.baidu.com.com', '2023-08-05', NULL, '这个网页是正常的', 0, 20001);

-- ----------------------------
-- Table structure for model
-- ----------------------------
DROP TABLE IF EXISTS `model`;
CREATE TABLE `model`  (
  `ID` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `score` float NULL DEFAULT NULL,
  `up_T` date NULL DEFAULT NULL,
  `admin_id` bigint NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `file` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `userId` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of model
-- ----------------------------
INSERT INTO `model` VALUES (1, 'GramBeddings-torch', 0.98, '2023-02-22', 10001, '禁用', NULL, NULL);
INSERT INTO `model` VALUES (2, 'GramBeddings-tf', 0.99, '2023-02-24', 10002, '使用中', NULL, NULL);

-- ----------------------------
-- Table structure for score
-- ----------------------------
DROP TABLE IF EXISTS `score`;
CREATE TABLE `score`  (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `actID` bigint NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `score` float(5, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 80038 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of score
-- ----------------------------
INSERT INTO `score` VALUES (80000, 80001, '参加者', 0.10);
INSERT INTO `score` VALUES (80001, 80001, '工作人员', 0.20);
INSERT INTO `score` VALUES (80003, 80002, '参加者', 0.10);
INSERT INTO `score` VALUES (80005, 80004, '工作人员', 0.20);
INSERT INTO `score` VALUES (80006, 80005, '参加者', 0.10);
INSERT INTO `score` VALUES (80007, 80006, '参加者', 0.10);
INSERT INTO `score` VALUES (80008, 80007, '参加者', 0.10);
INSERT INTO `score` VALUES (80009, 80008, '参加者', 0.10);
INSERT INTO `score` VALUES (80013, 123, '123', 1.00);
INSERT INTO `score` VALUES (80026, 80010, '参与者', 0.10);
INSERT INTO `score` VALUES (80027, 80012, '参与者', 0.10);
INSERT INTO `score` VALUES (80028, 80012, '工作人员', 0.20);
INSERT INTO `score` VALUES (80029, 80013, '一等奖', 1.00);
INSERT INTO `score` VALUES (80030, 80013, '二等奖', 0.50);
INSERT INTO `score` VALUES (80031, 80013, '三等奖', 0.30);
INSERT INTO `score` VALUES (80032, 80013, '参与者', 0.10);
INSERT INTO `score` VALUES (80033, 80014, '参与者', 0.10);
INSERT INTO `score` VALUES (80034, 80014, '工作人员', 0.20);
INSERT INTO `score` VALUES (80035, 80015, '三等奖', 0.30);
INSERT INTO `score` VALUES (80036, 80016, '二等奖', 0.50);
INSERT INTO `score` VALUES (80037, 80017, '二等奖', 0.50);
INSERT INTO `score` VALUES (80038, 80018, '三等奖', 0.30);

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`  (
  `ID` bigint NOT NULL,
  `phoneNumber` bigint NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `sex` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `collegeID` bigint NULL DEFAULT NULL,
  `class` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `facePic` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `faceFeature` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES (40001, NULL, 'Bill', 'anybrave', '2', 1, '18信息1', NULL, NULL);
INSERT INTO `student` VALUES (40002, NULL, '123456', '好好', '1', 1, '19软件1', 'faces\\40002.jpg', NULL);
INSERT INTO `student` VALUES (40003, NULL, '123456', '嘿嘿嘿', '1', 1, '19软件1', '', NULL);
INSERT INTO `student` VALUES (180110910118, NULL, '123', '测试用户1', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910215, NULL, '123', '测试用户2', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910218, NULL, '123', '测试用户3', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910219, NULL, '123', '测试用户4', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910221, NULL, '123', '测试用户5', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910225, NULL, '123', '测试用户6', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910234, 18920380003, '123', '测试学生7', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910235, 18958320002, '123', '测试学生8', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910302, 18958320001, '123', '测试学生9', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910305, 18958320004, '123', '测试学生10', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910317, 18958320005, '123', '测试学生11', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910329, 18958320006, '123', '测试学生13', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910332, 18958320007, '123', '测试学生12', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910334, 1895832008, '123', '测试学生14', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910338, 18958320009, '123', '测试学生15', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910403, 18958320010, '123', '测试学生16', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910410, NULL, '123', '测试学生17', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910411, NULL, '123', '测试学生18', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910414, NULL, '123', '测试学生19', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910436, NULL, '123', '测试学生', '2', 1, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910527, NULL, '123', '测试学生', '2', 3, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110910632, NULL, '123', '测试学生', '2', 2, '19信息2', NULL, NULL);
INSERT INTO `student` VALUES (180110930316, NULL, '123', '测试学生', '2', 2, '19信息2', NULL, NULL);

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher`  (
  `ID` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `permissionLevel` int NULL DEFAULT NULL,
  `collegeID` bigint NULL DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phoneNumber` bigint NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES (30001, '毛立晨', 2, 1, '2', 18920380001, '123');
INSERT INTO `teacher` VALUES (30002, '李靓', 2, 1, '2', 18920380002, '123');
INSERT INTO `teacher` VALUES (30003, '徐军军', 1, 1, '1', 18958320002, '123');

SET FOREIGN_KEY_CHECKS = 1;
