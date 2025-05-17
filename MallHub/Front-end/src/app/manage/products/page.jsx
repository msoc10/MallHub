import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AdminService } from "@/services/admin.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { formatError } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { paginationDefaultValues } from "@/lib/constants";
import StoreDiscountForm from "@/components/manage/store-discount-form";

const AdminProductsPage = () => {

    const [data, setData] = useState({
        items: [],
    });

    const [pagination, setPagination] = useState({
        ...paginationDefaultValues
    });

    const { toast } = useToast();

    useEffect(() => {
        const init = async () => {
            const request = await AdminService.getPaginatedProducts({ ...pagination });
            setData(request);
        }
        init().then();
    }, [pagination]);

    const onPageChange = (page) => {
        setPagination(prev => ({ ...prev, current_page: page }))
    }

    const onDelete = async (id) => {
        try {
            await AdminService.deleteCategory(id)
            setPagination(prev => ({ ...prev }))
        }
        catch (ex) {
            const error = formatError(ex);
            toast({
                ...error,
                variant: 'destructive'
            })
        }
    }
    
    // When discount changes, refresh product list to show updated prices
    const handleDiscountChange = () => {
        setPagination(prev => ({ ...prev }));
    }

    return (<div className="space-y-4">
        <div className="flex-between mb-4">
            <div className="flex items-center gap-3">
                <h1 className="h2-bold">Products</h1>
            </div>
            <div className="flex gap-x-2">
                <Button asChild variant={`default`}>
                    <Link to={`/manage/products/create`}>
                        Create Product
                    </Link>
                </Button>
            </div>
        </div>
        
        {/* Store Discount Form */}
        <StoreDiscountForm onDiscountChange={handleDiscountChange} />
        
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NAME</TableHead>
                        <TableHead>CATEGORY</TableHead>
                        <TableHead>REGULAR PRICE</TableHead>
                        <TableHead>DISCOUNTED PRICE</TableHead>
                        <TableHead>PRE-ORDER</TableHead>
                        <TableHead className="w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.items?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category_name}</TableCell>
                            <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                            <TableCell>
                                {item.has_discount ? (
                                    <span className="text-green-600 font-medium">${Number(item.discounted_price).toFixed(2)}</span>
                                ) : (
                                    "$" + Number(item.price).toFixed(2)
                                )}
                            </TableCell>
                            <TableCell>
                                {item.is_pre_order ? (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                        Pre-order
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                        No
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="flex gap-1">
                                <Button asChild variant={`outline`}>
                                    <Link to={`/manage/products/${item.id}`}>
                                        Edit
                                    </Link>
                                </Button>
                                <DeleteDialog id={item.id} action={onDelete} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        {data?.total_pages > 1 && <Pagination page={pagination.current_page} totalPages={data?.total_pages} onChange={onPageChange} />}

    </div>);
}

export default AdminProductsPage;