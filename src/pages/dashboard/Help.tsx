
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Help() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers and get help using LifePilot
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions and answers to help you get the most out of LifePilot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is LifePilot?</AccordionTrigger>
                <AccordionContent>
                  LifePilot is a comprehensive life management application designed to help you organize tasks, journal your thoughts, plan for the future, and gain insights from your data with AI assistance. Think of it as your personal dashboard for navigating life more effectively.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I create a task?</AccordionTrigger>
                <AccordionContent>
                  To create a task, navigate to the Tasks section and click the "New Task" button. Fill in the required information like title, description, due date, and priority, then click "Create Task". You can also create recurring tasks by toggling the "Routine Task" option.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I export my journal entries?</AccordionTrigger>
                <AccordionContent>
                  The export feature is coming soon. In a future update, you'll be able to export your journal entries in multiple formats including PDF and plain text. This will allow you to back up your thoughts or share them with others.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Your security and privacy are top priorities. All your data is encrypted and stored securely. Your journal entries and personal information never leave your device without your explicit permission. We also offer additional privacy options for sensitive information.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>What can the AI assistant help me with?</AccordionTrigger>
                <AccordionContent>
                  The AI assistant (coming soon) will help you analyze your tasks and journal entries for patterns, suggest optimizations to your schedule, provide insights about your habits and productivity, and answer questions about your data. It can also help you break down complex goals into manageable steps.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Need more help? Reach out to our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our support team is available Monday to Friday, 9am to 5pm EST. You can contact us at:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Email: support@lifepilot.example.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Live Chat: Available through the app during business hours</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
