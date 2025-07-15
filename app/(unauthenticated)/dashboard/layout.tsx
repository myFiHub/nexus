import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/Tabs";

export default function DashboardLayout({
  children,
  users,
  leaderboard,
}: {
  children: React.ReactNode;
  users: React.ReactNode;
  leaderboard: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="leaderboard">Leader board</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          {users}
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          {leaderboard}
        </TabsContent>
      </Tabs>
    </div>
  );
}
