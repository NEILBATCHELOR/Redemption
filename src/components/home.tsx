import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import RedemptionSummary from "./dashboard/RedemptionSummary";
import RedemptionRequestList from "./dashboard/RedemptionRequestList";
import RedemptionForm from "./redemption/RedemptionForm";
import BulkRedemptionForm from "./operations/BulkRedemptionForm";
import StatusTracker from "./redemption/StatusTracker";
import RedemptionCalendar from "./calendar/RedemptionCalendar";
import RedemptionDetails from "./redemption/RedemptionDetails";
import TransactionDetailsPanel from "./redemption/TransactionDetailsPanel";
import NotificationSettingsPage from "../pages/NotificationSettingsPage";
import ApproverPortalPage from "../pages/ApproverPortalPage";
import { NotificationToastContainer } from "./notifications/NotificationToast";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "./ui/button";
import { PlusCircle, ArrowLeft, Users, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

const Home = () => {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "details"
    | "calendar"
    | "transaction"
    | "bulk-redemption"
    | "new-request"
    | "notification-settings"
    | "approver-portal"
  >("dashboard");
  const [selectedRedemptionWindow, setSelectedRedemptionWindow] =
    useState<any>(null);

  const { notifications, dismissNotification, addNotification } =
    useNotifications();

  // Welcome notification disabled to reduce distractions

  const handleViewDetails = (id: string) => {
    setSelectedRequestId(id);
    setCurrentView("details");
  };

  const handleViewCalendar = () => {
    setCurrentView("calendar");
  };

  const handleViewTransactionHistory = () => {
    setCurrentView("transaction");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedRequestId(null);
    setSelectedRedemptionWindow(null);
  };

  const handleViewNotificationSettings = () => {
    setCurrentView("notification-settings");
  };

  const handleInitiateRedemption = (window: any) => {
    setIsNewRequestOpen(true);
  };

  const handleNewRequestSubmit = (values: any) => {
    console.log("New redemption request submitted:", values);
    setIsNewRequestOpen(false);
    // In a real app, this would submit the form data to an API

    // Submission notification disabled to reduce distractions
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <NotificationToastContainer
        notifications={notifications.filter((n) => !n.read).slice(0, 10)}
        onDismiss={dismissNotification}
      />

      <main className="container mx-auto px-4 py-8">
        {currentView === "dashboard" && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Investor Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your token redemption requests and track their status
                </p>
              </div>

              <Button
                className="mt-4 md:mt-0"
                size="lg"
                onClick={() => setCurrentView("new-request")}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                New Redemption Request
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <RedemptionSummary
                totalRequests={24}
                pendingApprovals={8}
                completedRedemptions={12}
                processingRedemptions={4}
              />

              <RedemptionRequestList onViewDetails={handleViewDetails} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Current Status</h2>
                  <StatusTracker
                    requestId="RDM-12345"
                    currentStatus="pending"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => setIsNewRequestOpen(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Redemption Request
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={handleViewCalendar}
                    >
                      View Redemption Calendar
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={handleViewTransactionHistory}
                    >
                      View Transaction History
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={handleViewNotificationSettings}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notification Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => setCurrentView("approver-portal")}
                    >
                      Approver Portal
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Operations Only
                  </h3>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => setCurrentView("bulk-redemption")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Bulk Redemption Operations
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === "details" && selectedRequestId && (
          <RedemptionDetails
            id={selectedRequestId}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === "calendar" && (
          <div>
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Redemption Calendar</h1>
            </div>
            <RedemptionCalendar
              onInitiateRedemption={handleInitiateRedemption}
            />
          </div>
        )}

        {currentView === "transaction" && (
          <div>
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Transaction History</h1>
            </div>
            <div className="space-y-6">
              <TransactionHistory requestId="RDM-12345" />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Blockchain Transactions
                </h2>
                <TransactionDetailsPanel />
                <TransactionDetailsPanel
                  transactionHash="0x8f7d2b8c6a2b3d4e5f1a2b3c4d5e6f7a8b9c0d1e"
                  settlementDate="2023-05-20T10:15:00Z"
                  status="completed"
                />
                <TransactionDetailsPanel
                  transactionHash="0x9e7d2b8c6a2b3d4e5f1a2b3c4d5e6f7a8b9c0d1"
                  settlementDate="2023-04-05T16:30:00Z"
                  status="completed"
                />
              </div>
            </div>
          </div>
        )}

        {currentView === "bulk-redemption" && (
          <div>
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Bulk Redemption Operations</h1>
            </div>
            <div className="space-y-6">
              <BulkRedemptionForm onSubmit={handleNewRequestSubmit} />
            </div>
          </div>
        )}

        {currentView === "new-request" && (
          <div>
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Create Redemption Request</h1>
            </div>
            <div className="space-y-6">
              <Tabs defaultValue="single" className="w-full max-w-5xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="single">Single Investor</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Redemption</TabsTrigger>
                </TabsList>
                <TabsContent value="single">
                  <RedemptionForm onSubmit={handleNewRequestSubmit} />
                </TabsContent>
                <TabsContent value="bulk">
                  <BulkRedemptionForm onSubmit={handleNewRequestSubmit} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {currentView === "notification-settings" && (
          <NotificationSettingsPage onBack={handleBackToDashboard} />
        )}

        {currentView === "approver-portal" && (
          <ApproverPortalPage onBack={handleBackToDashboard} />
        )}
      </main>
    </div>
  );
};

export default Home;
