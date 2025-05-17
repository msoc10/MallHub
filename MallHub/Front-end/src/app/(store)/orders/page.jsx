import LoadingPage from "@/app/loading";
import OrderStatus from "@/components/order/order-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ORDER_STATUS_ENUM } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { OrderService } from "@/services/order.service";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const OrdersPage = () => {


    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const order = await OrderService.getCustomerOrder();
                console.log(order)
                setData(order)
            } catch (ex) {
                console.log(ex);
            } finally {
                setLoading(false);
            }
        }
        init().then();
    }, [])

    const markAsDelivered = async (id) => {
        try {
            setLoading(true);
            await OrderService.updateOrderStatus({ id, status: ORDER_STATUS_ENUM.DELIVERED });
            const _data = structuredClone(data);
            _data.find(x => x.id === id).status = ORDER_STATUS_ENUM.DELIVERED;
            setData(_data)
        } catch (ex) {
            console.log(ex);
        } finally {
            setLoading(false);
        }
    }

    if (loading)
        return <LoadingPage />

    return (<div className="wrapper mt-4 grid gap-y-5">
        <div>
            <h1 className="h3-bold">Orders</h1>
            {!data && <div className="mt-2">
                No active orders. <Link to="/" >Go Shopping</Link>
            </div>}
        </div>

        {data &&
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>PAYMENT ID</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>ASSIGNED AT</TableHead>
                        <TableHead>DELIVERED AT</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>{data?.order_id}</TableCell>
                        <TableCell>{data?.payment_id}</TableCell>
                        <TableCell><OrderStatus status={data?.delivery_status} /></TableCell>
                        <TableCell>
                            {data?.assigned_at
                                ? formatDateTime(data?.assigned_at).dateTime
                                : <Badge variant={'destructive'}>Not Assigned</Badge>
                            }
                        </TableCell>
                        <TableCell>
                            {data?.delivered_at
                                ? formatDateTime(data?.delivered_at).dateTime
                                : data?.delivery_status == ORDER_STATUS_ENUM.IN_PROGRESS ?
                                    <Button size="sm" onClick={() => markAsDelivered(data?.order_id)}>Mark As Delivered</Button>
                                    : '-'
                            }
                        </TableCell>
                    </TableRow>

                </TableBody>
            </Table>

        }

    </div>);
}

export default OrdersPage;


