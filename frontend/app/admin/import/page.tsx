'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Database, FileJson, CheckCircle } from 'lucide-react';

export default function ImportPage() {
    const [dataType, setDataType] = useState<'lecturers' | 'subjects' | 'terms' | 'assignments'>('lecturers');
    const [jsonContent, setJsonContent] = useState('');

    const mutation = useMutation({
        mutationFn: () => {
            let parsedData;
            try {
                parsedData = JSON.parse(jsonContent);
                if (!Array.isArray(parsedData)) throw new Error('Dữ liệu phải là mảng JSON array');
            } catch (e) {
                throw new Error('JSON không hợp lệ');
            }
            return adminService.importBulk(dataType, parsedData);
        },
        onSuccess: (data) => {
            toast.success(`Import hoàn tất: ${data.data.success || data.data.count} bản ghi`);
            setJsonContent('');
        },
        onError: (err: any) => {
            toast.error(err.message || 'Import thất bại');
        }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Import Dữ Liệu</h1>
                <p className="text-slate-500">Nhập dữ liệu hàng loạt từ JSON</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                {/* Type Selector */}
                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                    {(['lecturers', 'subjects', 'terms', 'assignments'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setDataType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${dataType === type
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className="absolute top-3 right-3 text-xs text-slate-400 font-mono">
                        Target: /api/admin/bulk/{dataType}
                    </div>
                    <textarea
                        className="w-full h-96 p-4 font-mono text-sm bg-slate-900 text-green-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`[\\n  { "fullName": "Example", "email": "ex@edu.vn" },\\n  ...\\n]`}
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        size="lg"
                        onClick={() => mutation.mutate()}
                        isLoading={mutation.isPending}
                        disabled={!jsonContent}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Database className="w-4 h-4 mr-2" />
                        Tiến hành Import
                    </Button>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                <FileJson className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">Cấu trúc dữ liệu yêu cầu:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Lecturers:</strong> fullName*, staffId*, degreeCode (CN/ThS/TS/PGS/GS)</li>
                        <li><strong>Subjects:</strong> code*, name*, credits</li>
                        <li><strong>Terms:</strong> code* (VD: HK1_2425), name*, startDate, endDate</li>
                        <li><strong>Assignments:</strong> lecturerStaffId*, subjectCode*, termCode*, classCode</li>
                    </ul>
                    <p className="mt-2 text-blue-600 text-xs">* = bắt buộc. Xem IMPORT_TEMPLATES.md để có mẫu JSON chi tiết.</p>
                </div>
            </div>
        </div>
    );
}
