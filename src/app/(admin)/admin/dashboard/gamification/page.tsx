import {
  getAchievementsWithProgress,
  getBadgesByCategory,
  getDailyChallenges,
  getLeaderboard,
  getLevelRewards,
  getUserGamification,
} from "@/actions/gamification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  IconAward,
  IconCheck,
  IconCrown,
  IconFlame,
  IconGift,
  IconLock,
  IconMedal,
  IconRefresh,
  IconTarget,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  earned: boolean;
  date?: Date;
  rarity: string;
  progress?: number;
  target?: number;
}

interface Badge {
  name: string;
  icon: string;
  earned: boolean;
  category: string;
}

interface DailyChallenge {
  title: string;
  reward: number;
  progress: number;
  target: number;
  type: string;
  completed: boolean;
  percentage: number;
}

interface LeaderboardUser {
  name: string;
  level: number;
  xp: number;
  rank: number;
  avatar: string;
  isCurrentUser: boolean;
}

interface BadgeCategory {
  category: string;
  badges: Badge[];
}

export default async function GamificacaoPage() {
  // Buscar dados reais do banco de dados
  const [
    userStats,
    achievements,
    badgesByCategory,
    dailyChallenges,
    leaderboardData,
    levelRewards,
  ] = await Promise.all([
    getUserGamification(),
    getAchievementsWithProgress(),
    getBadgesByCategory(),
    getDailyChallenges(),
    getLeaderboard(),
    getLevelRewards(),
  ]);

  // Flatten badges para exibição
  const badges = badgesByCategory.flatMap(
    (category: BadgeCategory) => category.badges
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 bg-gray-100";
      case "rare":
        return "text-blue-600 bg-blue-100";
      case "epic":
        return "text-purple-600 bg-purple-100";
      case "legendary":
        return "text-orange-600 bg-orange-100";
      case "mythic":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "⭐";
      case "rare":
        return "🌟";
      case "epic":
        return "💫";
      case "legendary":
        return "🔥";
      case "mythic":
        return "👑";
      default:
        return "⭐";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gamificação</h1>
          <p className="text-muted-foreground mt-1">
            Complete desafios, ganhe XP e suba no ranking!
          </p>
        </div>
        <Button variant="outline" size="sm">
          <IconRefresh className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Nível e XP Principal */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-2 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userStats.level}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                  <IconCrown className="h-3 w-3" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  Nível {userStats.level}
                </h2>
                <p className="text-purple-700 dark:text-purple-300 font-medium">
                  {userStats.rank}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {userStats.currentXP.toLocaleString()}
              </div>
              <div className="text-purple-700 dark:text-purple-300">
                / {userStats.xpToNextLevel.toLocaleString()} XP
              </div>
            </div>
          </div>
          <Progress
            value={(userStats.currentXP / userStats.xpToNextLevel) * 100}
            className="h-3 bg-purple-200 dark:bg-purple-800"
          />
          <div className="flex items-center justify-between mt-2 text-sm text-purple-600 dark:text-purple-400">
            <span>Total: {userStats.totalXP.toLocaleString()} XP</span>
            <span>
              {userStats.xpToNextLevel - userStats.currentXP} XP para o próximo
              nível
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Sequência Atual
            </CardTitle>
            <IconFlame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {userStats.streak} dias
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Mantenha a chama acesa! 🔥
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Conquistas
            </CardTitle>
            <IconAward className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {userStats.achievements}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Desbloqueadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Badges
            </CardTitle>
            <IconMedal className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {userStats.badges}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Coletadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Ranking
            </CardTitle>
            <IconTrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              #{userStats.position}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Top{" "}
              {Math.round((userStats.position / userStats.totalUsers) * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção Principal - 2 Colunas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Conquistas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTrophy className="h-5 w-5" />
              Conquistas
            </CardTitle>
            <CardDescription>Desbloqueie conquistas e ganhe XP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.length > 0 ? (
              achievements.map((achievement: Achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    achievement.earned
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-medium text-sm ${
                          achievement.earned ? "" : "text-muted-foreground"
                        }`}
                      >
                        {achievement.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getRarityColor(
                          achievement.rarity
                        )}`}
                      >
                        {getRarityIcon(achievement.rarity)} {achievement.xp} XP
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Conquistado em {achievement.date.toLocaleDateString()}
                      </p>
                    )}
                    {!achievement.earned &&
                      achievement.progress !== undefined &&
                      achievement.target && (
                        <div className="mt-2">
                          <Progress
                            value={
                              (achievement.progress / achievement.target) * 100
                            }
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.progress} / {achievement.target}
                          </p>
                        </div>
                      )}
                  </div>
                  {achievement.earned ? (
                    <IconCheck className="h-5 w-5 text-green-600" />
                  ) : (
                    <IconLock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <IconTrophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conquista disponível</p>
                <p className="text-sm">
                  Continue estudando para desbloquear conquistas
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMedal className="h-5 w-5" />
              Badges
            </CardTitle>
            <CardDescription>
              Colete badges por suas habilidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge: Badge, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      badge.earned
                        ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                        : "bg-muted/30 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h4
                      className={`font-medium text-xs ${
                        badge.earned ? "" : "text-muted-foreground"
                      }`}
                    >
                      {badge.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.category}
                    </p>
                    {badge.earned && (
                      <IconCheck className="h-4 w-4 text-blue-600 mx-auto mt-2" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <IconMedal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma badge disponível</p>
                <p className="text-sm">
                  Continue estudando para desbloquear badges
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Desafios Diários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTarget className="h-5 w-5" />
            Desafios Diários
          </CardTitle>
          <CardDescription>
            Complete desafios diários para ganhar XP extra
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyChallenges.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {dailyChallenges.map(
                (challenge: DailyChallenge, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">{challenge.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        +{challenge.reward} XP
                      </Badge>
                    </div>
                    <Progress
                      value={challenge.percentage}
                      className="h-2 mb-2"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {challenge.progress} / {challenge.target}
                      </span>
                      <span>{challenge.percentage}%</span>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <IconTarget className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum desafio disponível</p>
              <p className="text-sm">Os desafios aparecerão aqui diariamente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranking da Comunidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Ranking da Comunidade
          </CardTitle>
          <CardDescription>Compita com outros estudantes</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboardData.leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboardData.leaderboard.map(
                (user: LeaderboardUser, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.isCurrentUser
                        ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 border-2 border-purple-300 dark:border-purple-700"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {user.rank === 1 && (
                          <IconCrown className="h-5 w-5 text-yellow-500" />
                        )}
                        {user.rank === 2 && (
                          <IconMedal className="h-5 w-5 text-gray-400" />
                        )}
                        {user.rank === 3 && (
                          <IconAward className="h-5 w-5 text-orange-500" />
                        )}
                        <span className="font-bold text-lg">#{user.rank}</span>
                      </div>
                      <div className="text-2xl">{user.avatar}</div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Nível {user.level}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {user.xp.toLocaleString()} XP
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.isCurrentUser ? "Você" : ""}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <IconUsers className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum usuário no ranking</p>
              <p className="text-sm">Seja o primeiro a aparecer aqui!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Próximas Recompensas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconGift className="h-5 w-5" />
            Próximas Recompensas
          </CardTitle>
          <CardDescription>
            O que você pode ganhar nos próximos níveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {levelRewards.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {levelRewards.map((reward, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{reward.icon}</span>
                    <h4 className="font-medium">Nível {reward.level}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {reward.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {reward.xpNeeded} XP restantes
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <IconGift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma recompensa configurada</p>
              <p className="text-sm">
                Continue subindo de nível para desbloquear recompensas
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
