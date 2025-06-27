"use client";

// Usage example:
//
// import { lumaUserDialog } from "app/components/Dialog";
//
// const handleManageUsers = async () => {
//   const result = await lumaUserDialog({
//     title: "Manage Users",
//     initialUsers: [
//       { email: "user1@example.com", name: "User One" },
//       { email: "user2@example.com", name: "User Two" }
//     ],
//     onAddUser: (user) => {
//       console.log('User added:', user);
//     },
//     onUserRemoved: (user) => {
//       console.log('User removed:', user);
//     }
//   });
//
//   if (result.confirmed) {
//     console.log("Final users:", result.users);
//   }
// };

import { Plus, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface LumaUser {
  email: string;
  name: string;
}

interface LumaUserDialogProps {
  title: ReactNode;
  initialUsers?: LumaUser[];
  onAddUser?: (user: LumaUser) => void;
  onUserRemoved?: (user: LumaUser) => void;
}

export type LumaUserDialogResult = {
  confirmed: boolean;
  users: LumaUser[];
};

let resolvePromise: ((value: LumaUserDialogResult) => void) | null = null;

export const lumaUserDialog = ({
  title,
  initialUsers = [],
  onAddUser,
  onUserRemoved,
}: LumaUserDialogProps): Promise<LumaUserDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-luma-user-dialog", {
      detail: {
        title,
        initialUsers,
        onAddUser,
        onUserRemoved,
      },
    });
    window.dispatchEvent(event);
  });
};

export const LumaUserDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [users, setUsers] = useState<LumaUser[]>([]);
  const [dialogContent, setDialogContent] =
    useState<LumaUserDialogProps | null>(null);

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<LumaUserDialogProps>) => {
      setDialogContent(event.detail);
      setUsers(event.detail.initialUsers || []);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-luma-user-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-luma-user-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleAddUser = () => {
    if (!email.trim()) return;

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Check if user with this email already exists
    if (users.some((user) => user.email.toLowerCase() === trimmedEmail)) {
      return;
    }

    const newUser: LumaUser = {
      email: trimmedEmail,
      name: trimmedName || trimmedEmail.split("@")[0],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Clear inputs
    setEmail("");
    setName("");

    // Fire onAddUser event
    dialogContent?.onAddUser?.(newUser);
  };

  const handleRemoveUser = (userToRemove: LumaUser) => {
    const updatedUsers = users.filter(
      (user) => user.email !== userToRemove.email
    );
    setUsers(updatedUsers);

    // Fire onUserRemoved event
    dialogContent?.onUserRemoved?.(userToRemove);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: true, users });
    resolvePromise = null;
    setEmail("");
    setName("");
    setUsers([]);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: false, users: [] });
    resolvePromise = null;
    setEmail("");
    setName("");
    setUsers([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddUser();
    }
  };

  const isEmailValid =
    email.trim() &&
    !users.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleConfirm();
        }
      }}
    >
      <DialogContent className="max-w-md min-h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogContent?.title}</DialogTitle>
        </DialogHeader>

        {/* Add User Section */}
        <div className="mb-4 space-y-3">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleAddUser}
            disabled={!isEmailValid}
            className="w-full"
            colorScheme="primary"
            variant="primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users List */}
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto max-h-64">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users added yet
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user, index) => (
                  <div
                    key={`${user.email}-${index}`}
                    className="flex items-center justify-between p-3 border border-border rounded-lg bg-accent/50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {user.name || user.email.split("@")[0]}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="w-full"
            onClick={handleConfirm}
            colorScheme="primary"
            variant="primary"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
