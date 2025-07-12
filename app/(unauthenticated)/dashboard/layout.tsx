import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/Tabs";

export default function DashboardLayout({
  children,
  users,
  tokens,
}: {
  children: React.ReactNode;
  users: React.ReactNode;
  tokens: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          {users}
        </TabsContent>

        <TabsContent value="tokens" className="mt-6">
          {tokens}
        </TabsContent>
      </Tabs>
    </div>
  );
}
