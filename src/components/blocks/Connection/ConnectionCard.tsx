import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Database, Clock, DatabaseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ConnectionProps {
    connection: {
        name: string;
        type: string;
        host: string;
        database: string;
        port?: number;
        lastSync: string;
    };
    index: number;
}

const ConnectionCard: React.FC<ConnectionProps> = ({ connection, index }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    return (
        <>
            {/* Card Component */}
            <Card
                key={index}
                className="border-green-200 bg-green-50/50 hover:shadow-lg transition-shadow cursor-pointer rounded-xl"
                onClick={openDialog}
            >
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Database className="h-6 w-6 text-green-600" />
                            <CardTitle className="text-lg font-semibold">{connection.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            Active
                        </Badge>
                    </div>
                    <CardDescription className="text-gray-600">{connection.type} Database</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground">Host</p>
                            <p className="font-medium truncate max-w-[200px]">{connection.host}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground">Database</p>
                            <p className="font-medium">{connection.database}</p>
                        </div>
                        {connection.port && (
                            <div className="flex items-center justify-between">
                                <p className="text-muted-foreground">Port</p>
                                <p className="font-medium">{connection.port}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {connection.lastSync}
                    </p>
                </CardFooter>
            </Card>

            {/* Dialog for Viewing More Details */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="p-6 max-w-4xl rounded-lg shadow-xl overflow-hidden bg-white border-green-600">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4"><DatabaseIcon className='text-green-600'/>{connection.name}</DialogTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Type</p>
                            <p className="text-lg font-medium text-gray-900">{connection.type}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Host</p>
                            <p className="text-lg font-medium text-gray-900">{connection.host}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Database</p>
                            <p className="text-lg font-medium text-gray-900">{connection.database}</p>
                        </div>
                        {connection.port && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Port</p>
                                <p className="text-lg font-medium text-gray-900">{connection.port}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Last Sync</p>
                            <p className="text-lg font-medium text-gray-900">{connection.lastSync}</p>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end">
                        <Button onClick={closeDialog} variant="outline" size="sm" className="text-green-600 bg-green-200 border-green-200">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ConnectionCard;
