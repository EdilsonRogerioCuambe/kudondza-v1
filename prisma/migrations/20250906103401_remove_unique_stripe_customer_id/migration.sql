-- CreateEnum
CREATE TYPE "public"."RoadmapStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "public"."CourseRelationType" AS ENUM ('PREREQUISITE', 'RECOMMENDED', 'SIMILAR', 'COMPLEMENTARY', 'ALTERNATIVE', 'SEQUEL', 'PART_OF_SERIES');

-- CreateEnum
CREATE TYPE "public"."RecommendationReason" AS ENUM ('SIMILAR_INTERESTS', 'COMPLETION_PATTERN', 'POPULAR_COMBINATION', 'SKILL_GAP', 'CAREER_PATH', 'TRENDING', 'INSTRUCTOR_RECOMMENDATION', 'AI_SUGGESTION');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('STUDENT', 'INSTRUCTOR', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "public"."CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."CourseStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('PDF', 'DOCUMENT', 'IMAGE', 'VIDEO', 'AUDIO', 'LINK', 'CODE');

-- CreateEnum
CREATE TYPE "public"."EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."BadgeRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "public"."XPSource" AS ENUM ('LESSON_COMPLETED', 'QUIZ_COMPLETED', 'COURSE_COMPLETED', 'STREAK_MILESTONE', 'BADGE_EARNED', 'REVIEW_POSTED', 'REFERRAL', 'PROJECT_SUBMITTED', 'COMPETITION_REWARD');

-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('TEXT', 'ACHIEVEMENT', 'COURSE_COMPLETION', 'BADGE_EARNED', 'PROJECT_SHARE', 'QUESTION', 'TIP');

-- CreateEnum
CREATE TYPE "public"."ReactionType" AS ENUM ('LIKE', 'LOVE', 'WOW', 'THINKING', 'CELEBRATE');

-- CreateEnum
CREATE TYPE "public"."GroupType" AS ENUM ('PUBLIC', 'PRIVATE', 'COURSE_BASED');

-- CreateEnum
CREATE TYPE "public"."GroupRole" AS ENUM ('OWNER', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "public"."CommunityType" AS ENUM ('PUBLIC', 'PRIVATE', 'COURSE_BASED', 'PROFESSIONAL', 'HOBBY', 'ACADEMIC');

-- CreateEnum
CREATE TYPE "public"."CommunityLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."CommunityRole" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "public"."MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('ONLINE', 'IN_PERSON', 'HYBRID', 'WORKSHOP', 'MEETUP', 'CONFERENCE', 'HACKATHON');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('DRAFT', 'UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "public"."AttendeeStatus" AS ENUM ('REGISTERED', 'CONFIRMED', 'ATTENDED', 'NO_SHOW', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('TEXT', 'VOICE', 'FILE', 'IMAGE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'CODE', 'ORDERING');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ACHIEVEMENT', 'SOCIAL', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."DashboardType" AS ENUM ('STUDENT', 'INSTRUCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'GRADED', 'RETURNED');

-- CreateEnum
CREATE TYPE "public"."SessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."CompetitionType" AS ENUM ('SPEED_LEARNING', 'QUIZ_BATTLE', 'PROJECT_CHALLENGE', 'STREAK_CHALLENGE');

-- CreateEnum
CREATE TYPE "public"."CompetitionStatus" AS ENUM ('UPCOMING', 'REGISTRATION_OPEN', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."GoalType" AS ENUM ('STUDY_TIME', 'COURSES_COMPLETED', 'LESSONS_COMPLETED', 'XP_EARNED', 'STREAK_DAYS', 'CERTIFICATES_EARNED', 'BADGES_EARNED', 'QUIZZES_COMPLETED', 'PROJECTS_SUBMITTED');

-- CreateEnum
CREATE TYPE "public"."GoalPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."ChallengeType" AS ENUM ('STUDY_TIME', 'EXERCISE_COMPLETION', 'LOGIN_STREAK', 'COURSE_COMPLETION', 'LESSON_COMPLETION', 'QUIZ_COMPLETION', 'PROJECT_SUBMISSION', 'SOCIAL_INTERACTION');

-- CreateEnum
CREATE TYPE "public"."RewardType" AS ENUM ('BADGE', 'TITLE', 'XP_BONUS', 'FEATURE_UNLOCK', 'CUSTOM_AVATAR', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('COURSE_VIEW', 'COURSE_ENROLLMENT', 'COURSE_COMPLETION', 'LESSON_VIEW', 'LESSON_COMPLETION', 'QUIZ_ATTEMPT', 'QUIZ_COMPLETION', 'ASSIGNMENT_SUBMISSION', 'REVIEW_POSTED', 'CERTIFICATE_EARNED', 'MENTOR_SESSION', 'RESOURCE_DOWNLOAD', 'POST_CREATED', 'COMMENT_POSTED', 'REACTION_ADDED', 'BADGE_EARNED', 'LOGIN', 'LOGOUT', 'PROFILE_UPDATE', 'SETTINGS_CHANGE');

-- CreateEnum
CREATE TYPE "public"."UploadStatus" AS ENUM ('PENDING', 'UPLOADING', 'COMPLETED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'UNPAID', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'PAUSED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "public"."EmailNotificationType" AS ENUM ('SUBSCRIPTION_RENEWAL_REMINDER', 'SUBSCRIPTION_EXPIRING', 'SUBSCRIPTION_CANCELED', 'SUBSCRIPTION_RENEWED', 'PAYMENT_FAILED', 'PAYMENT_SUCCEEDED', 'TRIAL_ENDING', 'WELCOME');

-- CreateEnum
CREATE TYPE "public"."EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'BOUNCED', 'DELIVERED');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'STUDENT',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "bio" TEXT,
    "location" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "socialLinks" JSONB,
    "preferences" JSONB,
    "lastLoginAt" TIMESTAMP(3),
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT DEFAULT 'UTC',
    "language" TEXT NOT NULL DEFAULT 'pt',
    "theme" TEXT NOT NULL DEFAULT 'light',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "courseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subcategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "courseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "thumbnail" TEXT,
    "trailer" TEXT,
    "courseMaterials" TEXT,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "tags" TEXT[],
    "level" "public"."CourseLevel" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'pt',
    "duration" INTEGER,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "originalPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'MZN',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "allowDownload" BOOLEAN NOT NULL DEFAULT false,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "hasPrerequisites" BOOLEAN NOT NULL DEFAULT false,
    "seriesId" TEXT,
    "unlockCriteria" JSONB,
    "status" "public"."CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "xpReward" INTEGER NOT NULL DEFAULT 500,
    "badgeId" TEXT,
    "instructorId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredAt" TIMESTAMP(3),
    "trendingScore" DECIMAL(5,2) NOT NULL DEFAULT 0,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_prerequisites" (
    "id" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "minimumProgress" INTEGER NOT NULL DEFAULT 100,
    "courseId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,

    CONSTRAINT "course_prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "isSequential" BOOLEAN NOT NULL DEFAULT true,
    "level" "public"."CourseLevel" NOT NULL,
    "categoryId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_relations" (
    "id" TEXT NOT NULL,
    "type" "public"."CourseRelationType" NOT NULL,
    "strength" INTEGER NOT NULL DEFAULT 5,
    "sourceCourseId" TEXT NOT NULL,
    "targetCourseId" TEXT NOT NULL,

    CONSTRAINT "course_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_paths" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_path_courses" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "notes" TEXT,
    "pathId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "learning_path_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_path_followers" (
    "id" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,

    CONSTRAINT "learning_path_followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_recommendations" (
    "id" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "reason" "public"."RecommendationReason" NOT NULL,
    "context" JSONB,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isViewed" BOOLEAN NOT NULL DEFAULT false,
    "isAccepted" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "course_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roadmaps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "thumbnail" TEXT,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "tags" TEXT[],
    "level" "public"."CourseLevel" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'pt',
    "estimatedDuration" INTEGER,
    "totalCourses" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."RoadmapStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roadmap_paths" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isParallel" BOOLEAN NOT NULL DEFAULT false,
    "unlockCriteria" JSONB,
    "roadmapId" TEXT NOT NULL,

    CONSTRAINT "roadmap_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roadmap_courses" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "unlockCriteria" JSONB,
    "pathId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "roadmap_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roadmap_enrollments" (
    "id" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "progress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "coursesStarted" INTEGER NOT NULL DEFAULT 0,
    "coursesCompleted" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPathId" TEXT,
    "currentCourseId" TEXT,
    "userId" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,

    CONSTRAINT "roadmap_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roadmap_analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "enrollments" INTEGER NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,
    "avgCompletionTime" INTEGER NOT NULL DEFAULT 0,
    "dropoffRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "roadmapId" TEXT NOT NULL,

    CONSTRAINT "roadmap_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."modules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "unlockCriteria" JSONB,
    "xpReward" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lessons" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "order" INTEGER NOT NULL,
    "slug" TEXT,
    "videoUrl" TEXT,
    "videoDuration" INTEGER,
    "transcript" TEXT,
    "isPreview" BOOLEAN NOT NULL DEFAULT false,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "unlockCriteria" JSONB,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."ResourceType" NOT NULL,
    "url" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "downloadable" BOOLEAN NOT NULL DEFAULT true,
    "lessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enrollments" (
    "id" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "status" "public"."EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "progress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "allowTracking" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."progress" (
    "id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchProgress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gamification" (
    "id" TEXT NOT NULL,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "xpToNextLevel" INTEGER NOT NULL DEFAULT 500,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastStudyDate" TIMESTAMP(3),
    "coursesCompleted" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "quizzesCompleted" INTEGER NOT NULL DEFAULT 0,
    "certificatesEarned" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "gamification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "rarity" "public"."BadgeRarity" NOT NULL DEFAULT 'COMMON',
    "xpReward" INTEGER NOT NULL DEFAULT 100,
    "criteria" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isLimited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_badges" (
    "id" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "gamificationId" TEXT NOT NULL,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."xp_history" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "source" "public"."XPSource" NOT NULL,
    "sourceId" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "gamificationId" TEXT NOT NULL,

    CONSTRAINT "xp_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."PostType" NOT NULL DEFAULT 'TEXT',
    "media" TEXT[],
    "metadata" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "allowComments" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "courseId" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reactions" (
    "id" TEXT NOT NULL,
    "type" "public"."ReactionType" NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."follows" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."communities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "avatar" TEXT,
    "cover" TEXT,
    "banner" TEXT,
    "type" "public"."CommunityType" NOT NULL DEFAULT 'PUBLIC',
    "level" "public"."CommunityLevel" NOT NULL DEFAULT 'ALL_LEVELS',
    "maxMembers" INTEGER,
    "allowInvites" BOOLEAN NOT NULL DEFAULT true,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "subcategoryId" TEXT,
    "tags" TEXT[],
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "allowPosts" BOOLEAN NOT NULL DEFAULT true,
    "allowEvents" BOOLEAN NOT NULL DEFAULT true,
    "allowPolls" BOOLEAN NOT NULL DEFAULT true,
    "autoModerate" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "featuredAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_members" (
    "id" TEXT NOT NULL,
    "role" "public"."CommunityRole" NOT NULL DEFAULT 'MEMBER',
    "status" "public"."MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "isModerator" BOOLEAN NOT NULL DEFAULT false,
    "postsCount" INTEGER NOT NULL DEFAULT 0,
    "eventsCount" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "community_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."PostType" NOT NULL DEFAULT 'TEXT',
    "media" TEXT[],
    "metadata" JSONB,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isAnnouncement" BOOLEAN NOT NULL DEFAULT false,
    "allowComments" BOOLEAN NOT NULL DEFAULT true,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pinnedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_reactions" (
    "id" TEXT NOT NULL,
    "type" "public"."ReactionType" NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "community_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."EventType" NOT NULL DEFAULT 'ONLINE',
    "location" TEXT,
    "meetingUrl" TEXT,
    "maxAttendees" INTEGER,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "price" DECIMAL(10,2),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "attendeeCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "community_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_attendees" (
    "id" TEXT NOT NULL,
    "status" "public"."AttendeeStatus" NOT NULL DEFAULT 'REGISTERED',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_polls" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT,
    "options" JSONB NOT NULL,
    "allowMultipleVotes" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "endDate" TIMESTAMP(3),
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "community_polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."poll_votes" (
    "id" TEXT NOT NULL,
    "option" INTEGER NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "poll_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_rules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "community_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "newMembers" INTEGER NOT NULL DEFAULT 0,
    "posts" INTEGER NOT NULL DEFAULT 0,
    "events" INTEGER NOT NULL DEFAULT 0,
    "engagement" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "community_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "avatar" TEXT,
    "cover" TEXT,
    "type" "public"."GroupType" NOT NULL DEFAULT 'PUBLIC',
    "maxMembers" INTEGER NOT NULL DEFAULT 50,
    "allowInvites" BOOLEAN NOT NULL DEFAULT true,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_members" (
    "id" TEXT NOT NULL,
    "role" "public"."GroupRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."MessageType" NOT NULL DEFAULT 'TEXT',
    "attachments" TEXT[],
    "metadata" JSONB,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message_recipients" (
    "id" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "messageId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,

    CONSTRAINT "message_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."certificates" (
    "id" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "templateData" JSONB NOT NULL,
    "certificateUrl" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "validUntil" TIMESTAMP(3),
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quizzes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "timeLimit" INTEGER,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT true,
    "showResults" BOOLEAN NOT NULL DEFAULT true,
    "xpReward" INTEGER NOT NULL DEFAULT 100,
    "allowedQuestionTypes" JSONB NOT NULL DEFAULT '["MULTIPLE_CHOICE", "MULTIPLE_SELECT", "TRUE_FALSE"]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswers" JSONB NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quiz_attempts" (
    "id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'INFO',
    "data" JSONB,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "autoRemoveCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_items" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "lessonId" TEXT,
    "courseId" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" TEXT NOT NULL,

    CONSTRAINT "playlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "lessonsWatched" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "enrollments" INTEGER NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3,2),
    "courseId" TEXT NOT NULL,

    CONSTRAINT "course_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,
    "avgWatchTime" INTEGER NOT NULL DEFAULT 0,
    "dropoffRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "lesson_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "maxSubmissions" INTEGER NOT NULL DEFAULT 3,
    "allowLateSubmission" BOOLEAN NOT NULL DEFAULT false,
    "maxPoints" INTEGER NOT NULL DEFAULT 100,
    "rubric" JSONB,
    "xpReward" INTEGER NOT NULL DEFAULT 150,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submissions" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[],
    "score" INTEGER,
    "feedback" TEXT,
    "gradedAt" TIMESTAMP(3),
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mentor_sessions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(10,2),
    "meetingUrl" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "status" "public"."SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "mentorRating" INTEGER,
    "menteeRating" INTEGER,
    "mentorFeedback" TEXT,
    "menteeFeedback" TEXT,
    "mentorId" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,

    CONSTRAINT "mentor_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."competitions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "type" "public"."CompetitionType" NOT NULL DEFAULT 'SPEED_LEARNING',
    "maxParticipants" INTEGER,
    "prizes" JSONB NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "registrationEnd" TIMESTAMP(3) NOT NULL,
    "status" "public"."CompetitionStatus" NOT NULL DEFAULT 'UPCOMING',

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."competition_participants" (
    "id" TEXT NOT NULL,
    "score" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "metrics" JSONB NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "competition_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."GoalType" NOT NULL,
    "target" INTEGER NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "period" "public"."GoalPeriod",
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."ChallengeType" NOT NULL,
    "target" INTEGER NOT NULL,
    "reward" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_challenges" (
    "id" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,

    CONSTRAINT "user_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."level_rewards" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."RewardType" NOT NULL,
    "value" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "level_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_level_rewards" (
    "id" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "levelRewardId" TEXT NOT NULL,

    CONSTRAINT "user_level_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "changes" JSONB,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "userId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeProductId" TEXT,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "stripeInvoiceId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MZN',
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "metadata" JSONB,
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webhook_events" (
    "id" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "data" JSONB NOT NULL,
    "apiVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MZN',
    "interval" TEXT NOT NULL,
    "intervalCount" INTEGER NOT NULL DEFAULT 1,
    "stripePriceId" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "features" JSONB NOT NULL,
    "maxUsers" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_notifications" (
    "id" TEXT NOT NULL,
    "type" "public"."EmailNotificationType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "public"."EmailStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "template" TEXT,
    "variables" JSONB,
    "scheduledFor" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."ActivityType" NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "courseId" TEXT,
    "lessonId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file_uploads" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "fileExtension" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "uploadStatus" "public"."UploadStatus" NOT NULL DEFAULT 'PENDING',
    "uploadedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "tempUpload" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_slug_key" ON "public"."subcategories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "public"."courses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_stripeProductId_key" ON "public"."courses"("stripeProductId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_stripePriceId_key" ON "public"."courses"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "course_prerequisites_courseId_prerequisiteId_key" ON "public"."course_prerequisites"("courseId", "prerequisiteId");

-- CreateIndex
CREATE UNIQUE INDEX "course_relations_sourceCourseId_targetCourseId_type_key" ON "public"."course_relations"("sourceCourseId", "targetCourseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "learning_path_courses_pathId_order_key" ON "public"."learning_path_courses"("pathId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "learning_path_followers_userId_pathId_key" ON "public"."learning_path_followers"("userId", "pathId");

-- CreateIndex
CREATE UNIQUE INDEX "course_recommendations_userId_courseId_key" ON "public"."course_recommendations"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmaps_slug_key" ON "public"."roadmaps"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_paths_roadmapId_order_key" ON "public"."roadmap_paths"("roadmapId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_courses_pathId_order_key" ON "public"."roadmap_courses"("pathId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_courses_pathId_courseId_key" ON "public"."roadmap_courses"("pathId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_enrollments_userId_roadmapId_key" ON "public"."roadmap_enrollments"("userId", "roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_analytics_roadmapId_date_key" ON "public"."roadmap_analytics"("roadmapId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "modules_courseId_order_key" ON "public"."modules"("courseId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "modules_courseId_slug_key" ON "public"."modules"("courseId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_moduleId_order_key" ON "public"."lessons"("moduleId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_moduleId_slug_key" ON "public"."lessons"("moduleId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON "public"."enrollments"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "progress_userId_lessonId_key" ON "public"."progress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "gamification_userId_key" ON "public"."gamification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "public"."badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "public"."user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "public"."follows"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "communities_slug_key" ON "public"."communities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "community_members_userId_communityId_key" ON "public"."community_members"("userId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendees_userId_eventId_key" ON "public"."event_attendees"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "poll_votes_userId_pollId_key" ON "public"."poll_votes"("userId", "pollId");

-- CreateIndex
CREATE UNIQUE INDEX "community_rules_communityId_order_key" ON "public"."community_rules"("communityId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "community_analytics_communityId_date_key" ON "public"."community_analytics"("communityId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_userId_groupId_key" ON "public"."group_members"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "message_recipients_messageId_recipientId_key" ON "public"."message_recipients"("messageId", "recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificateNumber_key" ON "public"."certificates"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_verificationCode_key" ON "public"."certificates"("verificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "questions_quizId_order_key" ON "public"."questions"("quizId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_courseId_key" ON "public"."reviews"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_items_playlistId_order_key" ON "public"."playlist_items"("playlistId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "user_analytics_userId_date_key" ON "public"."user_analytics"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "course_analytics_courseId_date_key" ON "public"."course_analytics"("courseId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_analytics_lessonId_date_key" ON "public"."lesson_analytics"("lessonId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_userId_assignmentId_key" ON "public"."submissions"("userId", "assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "competition_participants_userId_competitionId_key" ON "public"."competition_participants"("userId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_challenges_userId_challengeId_key" ON "public"."user_challenges"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "level_rewards_level_key" ON "public"."level_rewards"("level");

-- CreateIndex
CREATE UNIQUE INDEX "user_level_rewards_userId_levelRewardId_key" ON "public"."user_level_rewards"("userId", "levelRewardId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "public"."subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentId_key" ON "public"."payments"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_stripeEventId_key" ON "public"."webhook_events"("stripeEventId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_stripePriceId_key" ON "public"."subscription_plans"("stripePriceId");

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subcategories" ADD CONSTRAINT "subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."course_series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_prerequisites" ADD CONSTRAINT "course_prerequisites_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_prerequisites" ADD CONSTRAINT "course_prerequisites_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_series" ADD CONSTRAINT "course_series_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_series" ADD CONSTRAINT "course_series_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_relations" ADD CONSTRAINT "course_relations_sourceCourseId_fkey" FOREIGN KEY ("sourceCourseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_relations" ADD CONSTRAINT "course_relations_targetCourseId_fkey" FOREIGN KEY ("targetCourseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_paths" ADD CONSTRAINT "learning_paths_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_path_courses" ADD CONSTRAINT "learning_path_courses_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "public"."learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_path_courses" ADD CONSTRAINT "learning_path_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_path_followers" ADD CONSTRAINT "learning_path_followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_path_followers" ADD CONSTRAINT "learning_path_followers_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "public"."learning_paths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_recommendations" ADD CONSTRAINT "course_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_recommendations" ADD CONSTRAINT "course_recommendations_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmaps" ADD CONSTRAINT "roadmaps_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmaps" ADD CONSTRAINT "roadmaps_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmaps" ADD CONSTRAINT "roadmaps_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmap_paths" ADD CONSTRAINT "roadmap_paths_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "public"."roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmap_courses" ADD CONSTRAINT "roadmap_courses_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "public"."roadmap_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmap_courses" ADD CONSTRAINT "roadmap_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmap_enrollments" ADD CONSTRAINT "roadmap_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmap_enrollments" ADD CONSTRAINT "roadmap_enrollments_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "public"."roadmaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roadmap_analytics" ADD CONSTRAINT "roadmap_analytics_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "public"."roadmaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."modules" ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lessons" ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progress" ADD CONSTRAINT "progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progress" ADD CONSTRAINT "progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gamification" ADD CONSTRAINT "gamification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_badges" ADD CONSTRAINT "user_badges_gamificationId_fkey" FOREIGN KEY ("gamificationId") REFERENCES "public"."gamification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."xp_history" ADD CONSTRAINT "xp_history_gamificationId_fkey" FOREIGN KEY ("gamificationId") REFERENCES "public"."gamification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."communities" ADD CONSTRAINT "communities_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."communities" ADD CONSTRAINT "communities_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."communities" ADD CONSTRAINT "communities_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_members" ADD CONSTRAINT "community_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_members" ADD CONSTRAINT "community_members_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_posts" ADD CONSTRAINT "community_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_posts" ADD CONSTRAINT "community_posts_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "community_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."community_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "community_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "community_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_reactions" ADD CONSTRAINT "community_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_reactions" ADD CONSTRAINT "community_reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_reactions" ADD CONSTRAINT "community_reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."community_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_events" ADD CONSTRAINT "community_events_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_events" ADD CONSTRAINT "community_events_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_attendees" ADD CONSTRAINT "event_attendees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_attendees" ADD CONSTRAINT "event_attendees_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."community_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_polls" ADD CONSTRAINT "community_polls_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_polls" ADD CONSTRAINT "community_polls_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."poll_votes" ADD CONSTRAINT "poll_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."poll_votes" ADD CONSTRAINT "poll_votes_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."community_polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_rules" ADD CONSTRAINT "community_rules_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_analytics" ADD CONSTRAINT "community_analytics_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_members" ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_members" ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message_recipients" ADD CONSTRAINT "message_recipients_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message_recipients" ADD CONSTRAINT "message_recipients_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quizzes" ADD CONSTRAINT "quizzes_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlists" ADD CONSTRAINT "playlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_items" ADD CONSTRAINT "playlist_items_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_items" ADD CONSTRAINT "playlist_items_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_analytics" ADD CONSTRAINT "user_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_analytics" ADD CONSTRAINT "course_analytics_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_analytics" ADD CONSTRAINT "lesson_analytics_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mentor_sessions" ADD CONSTRAINT "mentor_sessions_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mentor_sessions" ADD CONSTRAINT "mentor_sessions_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."competition_participants" ADD CONSTRAINT "competition_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."competition_participants" ADD CONSTRAINT "competition_participants_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_goals" ADD CONSTRAINT "user_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_challenges" ADD CONSTRAINT "user_challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_challenges" ADD CONSTRAINT "user_challenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."daily_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_level_rewards" ADD CONSTRAINT "user_level_rewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_level_rewards" ADD CONSTRAINT "user_level_rewards_levelRewardId_fkey" FOREIGN KEY ("levelRewardId") REFERENCES "public"."level_rewards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."webhook_events" ADD CONSTRAINT "webhook_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_activities" ADD CONSTRAINT "user_activities_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_activities" ADD CONSTRAINT "user_activities_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_uploads" ADD CONSTRAINT "file_uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_uploads" ADD CONSTRAINT "file_uploads_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
