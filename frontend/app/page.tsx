"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "@/hooks/use-toast"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {Textarea} from "@/components/ui/textarea"

import {Edit, Trash} from "lucide-react";

import {
    useCreateMessageMutation,
    useDeleteMessageMutation,
    useGetAllMessagesQuery,
    useUpdateMessageMutation,
} from '@/services/messageAPI';

import {useState} from "react";

const FormSchema = z.object({
    content: z.string().min(1, {
        message: "The message cannot be empty.",
    }),
})

interface Message {
    id: string;
    content: string;
}


export default function Home() {
    const {data: messages, error, isLoading} = useGetAllMessagesQuery(undefined);
    const [createMessage] = useCreateMessageMutation();
    const [updateMessage] = useUpdateMessageMutation();
    const [deleteMessage] = useDeleteMessageMutation();

    const [editMessage, setEditMessage] = useState<Message | null>(null);
    const [editContent, setEditContent] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            content: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await createMessage(data).unwrap();
            form.reset();

            toast({
                title: "Message sent!"
            })
        } catch (err) {
            console.error('Error creating message:', err);
        }
    }

    const openEditDialog = (msg: Message) => {
        setEditMessage(msg)
        setEditContent(msg.content)
    }

    const handleSaveEdit = async () => {
        if (!editMessage) return

        try {
            await updateMessage({id: editMessage.id, content: editContent}).unwrap()
            toast({title: "Message updated!"})
            setEditMessage(null)
        } catch (err) {
            console.error("Error updating:", err)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteMessage(id).unwrap();
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    const filteredMessages = (messages || []).filter((item: Message) =>
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading messages</p>;

    return (
        <div className="relative min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start pb-52">
                <p className="text-center w-full">Interview Task - Messages Manager</p>

                {/* Filtering field */}
                <div className="w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Filter messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/*Main content*/}
                <Table>
                    <TableCaption>A list of messages stored in the database.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="w-[140px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMessages.length > 0 ? (
                            filteredMessages.map((item: { id: string; content: string }) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell
                                        className="font-medium whitespace-normal break-all">{item.content}</TableCell>
                                    <TableCell className="w-[140px]">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditDialog(item)}
                                                className="p-1 hover:bg-slate-200 rounded">
                                                <Edit size={16}/>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1 hover:bg-slate-200 rounded">
                                                <Trash size={16}/>
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No messages matching search criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 shadow w-full h-1/4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                              className="h-full flex flex-col justify-between space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Message</FormLabel>
                                        <FormControl className="h-5/6 w-full">
                                            <Textarea placeholder="Type message" {...field}
                                                      className="resize-none min-h-[100px] p-2"/>
                                        </FormControl>
                                        <FormDescription>
                                            Message will be added to the database.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit">Add</Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Editing messages dialog */}
                {editMessage && (
                    <Dialog open={true} onOpenChange={(open) => !open && setEditMessage(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Message</DialogTitle>
                                <DialogDescription>
                                    Enter new message content.
                                </DialogDescription>
                            </DialogHeader>
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full resize-none min-h-[100px] p-2 mb-4"
                            />
                            <DialogFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setEditMessage(null)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveEdit}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </main>
        </div>
    );
}
