'use client';

import { useState } from 'react';
import { Reply } from '@/types/academic';
import { VoteButtons } from './vote-buttons';
import { Button } from '@/components/ui/button';
import { MessageSquare, Reply as ReplyIcon } from 'lucide-react';
import { ReplyForm } from './reply-form';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { RoleBadge } from '@/components/ui/RoleBadge';

interface ReplyItemProps {
    reply: Reply;
    reviewId: string;
}

export function ReplyItem({ reply, reviewId }: ReplyItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { user } = useAuth();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="group mt-3">
            <div className="flex gap-3">
                {/* Avatar Mini */}
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                    {reply.user.fullName.charAt(0)}
                </div>

                <div className="flex-1">
                    <div className="bg-slate-50 rounded-2xl p-3 px-4 inline-block">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-900">{reply.user.fullName}</span>
                            <RoleBadge roles={reply.user.roles} />
                            <span className="text-xs text-slate-400">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-1 ml-2">
                        <VoteButtons
                            id={reply.id}
                            type="REPLY"
                            initialUp={reply.upvoteCount}
                            initialDown={reply.downvoteCount}
                        />

                        {user && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs text-slate-500 font-medium hover:text-blue-600 transition-colors flex items-center gap-1"
                            >
                                <ReplyIcon className="w-3 h-3" /> Trả lời
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3">
                            <ReplyForm
                                reviewId={reviewId}
                                parentId={reply.id}
                                onSuccess={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}

                    {/* Nested Replies */}
                    {reply.replies && reply.replies.length > 0 && (
                        <div className="mt-3 pl-2 border-l-2 border-slate-100">
                            {reply.replies.map(nestedReply => (
                                <ReplyItem key={nestedReply.id} reply={nestedReply} reviewId={reviewId} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
