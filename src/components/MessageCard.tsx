'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from "sonner"
import { ApiResponse } from '@/types/apiResponse'

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
 

     // make sure you have imported it properly

     const handleDeleteConfirm = async () => {
      try {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        
        toast.success(response.data.message);
        onMessageDelete(message._id);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data.message ?? 'Failed to delete message'  
          );
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    };
    
    

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}