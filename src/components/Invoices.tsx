import { Invoice, InvoiceStatus } from '@/core/client'
import { formatDateTime } from '@/utils/others'
import clsx from 'clsx'
import { BanknoteIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

const statusStyles: Record<InvoiceStatus, string> = {
	paid: 'bg-green-100 text-green-800',
	pending: 'bg-yellow-100 text-yellow-800',
	expired: 'bg-red-100 text-red-800',
	error: 'bg-red-600 text-white',
}

interface InvoicesProps {
	invoices: Invoice[]
	count: number
	offset: number
	serviceIdOrSlug: string
	showPagination?: boolean
}

export default async function Invoices({
	invoices,
	count,
	offset,
	serviceIdOrSlug,
	showPagination = true,
}: InvoicesProps) {
	const from = invoices.length > 0 ? offset + 1 : 0
	const to = invoices.length + offset
	const previousPage = from > 1 && Math.floor(from / 10)
	const nextPage = to < count && Math.floor(to / 10) + 1

	return (
		<>
			{/* Activity list (smallest breakpoint only) */}
			<div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 sm:hidden">
				{count > 0 && (
					<ul
						role="list"
						className="mt-2 divide-y divide-slate-200 overflow-hidden shadow sm:hidden"
					>
						{invoices?.map(invoice => (
							<li key={invoice.id}>
								<a
									href={`/invoices/${invoice.id}`}
									className="block bg-white px-4 py-4 hover:bg-slate-100"
								>
									<span className="flex items-center space-x-4">
										<span className="flex flex-1 space-x-2 truncate">
											<BanknoteIcon
												className="h-5 w-5 flex-shrink-0 text-slate-400"
												aria-hidden="true"
											/>
											<span className="flex flex-col truncate text-sm text-slate-500">
												<span className="truncate">{invoice.title}</span>
												<span>
													<span className="font-medium text-slate-900">
														{invoice.price}
													</span>{' '}
													{invoice.currency}
												</span>
												<time dateTime={invoice.created_at}>
													{formatDateTime(invoice.created_at)}
												</time>
											</span>
										</span>
										<ChevronRightIcon
											className="h-5 w-5 flex-shrink-0 text-slate-400"
											aria-hidden="true"
										/>
									</span>
								</a>
							</li>
						))}
					</ul>
				)}

				{count > 0 ? (
					<nav
						className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3"
						aria-label="Pagination"
					>
						<div className="flex flex-1 justify-between">
							{previousPage ? (
								<a
									href="#"
									className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
								>
									Previous
								</a>
							) : (
								<div />
							)}
							{nextPage ? (
								<a
									href="#"
									className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
								>
									Next
								</a>
							) : (
								<div />
							)}
						</div>
					</nav>
				) : (
					<div className="flex items-center justify-center bg-white px-4 py-3">
						<p className="text-sm text-slate-700">
							<span className="font-medium">No results</span>
						</p>
					</div>
				)}
			</div>

			{/* Activity table (small breakpoint and up) */}
			<div className="hidden sm:block">
				<div className="mx-auto max-w-7xl">
					<div className="mt-2 flex flex-col">
						<div className="min-w-full overflow-hidden overflow-x-auto rounded-lg border border-slate-200 align-middle">
							<table className="min-w-full divide-y divide-slate-200">
								<thead>
									<tr>
										<th
											className="bg-slate-100 px-6 py-3 text-left text-sm font-semibold text-slate-900"
											scope="col"
										>
											Title
										</th>
										<th
											className="bg-slate-100 px-6 py-3 text-right text-sm font-semibold text-slate-900"
											scope="col"
										>
											Amount
										</th>
										<th
											className="hidden bg-slate-100 px-6 py-3 text-left text-sm font-semibold text-slate-900 md:block"
											scope="col"
										>
											Status
										</th>
										<th
											className="bg-slate-100 px-6 py-3 text-right text-sm font-semibold text-slate-900"
											scope="col"
										>
											Date
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200 bg-white">
									{invoices?.map(invoice => (
										<tr key={invoice.id} className="bg-white">
											<td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-slate-900">
												<div className="flex">
													<Link
														href={
															serviceIdOrSlug
																? `/${serviceIdOrSlug}/invoices/${invoice.id}`
																: `/invoices/${invoice.id}`
														}
														className="group inline-flex space-x-2 truncate text-sm"
													>
														<BanknoteIcon
															className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500"
															aria-hidden="true"
														/>
														<p className="truncate text-slate-500 group-hover:text-slate-900">
															{invoice.title}
														</p>
													</Link>
												</div>
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
												<span className="font-medium text-slate-900">
													{invoice.price}
												</span>{' '}
												{invoice.currency}
											</td>
											<td className="hidden whitespace-nowrap px-6 py-4 text-sm text-slate-500 md:block">
												<span
													className={clsx(
														statusStyles[invoice.status],
														'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
													)}
												>
													{invoice.status}
												</span>
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
												<time dateTime={invoice.created_at}>
													{formatDateTime(invoice.created_at)}
												</time>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{/* Pagination */}
							{showPagination && (
								<nav
									className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6"
									aria-label="Pagination"
								>
									<div className="hidden sm:block">
										{count > 0 ? (
											<p className="text-sm text-slate-700">
												Showing <span className="font-medium">{from}</span> to{' '}
												<span className="font-medium">{to}</span> of{' '}
												<span className="font-medium">{count}</span> results
											</p>
										) : (
											<p className="text-sm text-slate-700">
												<span className="font-medium">No results</span>
											</p>
										)}
									</div>
									<div className="flex flex-1 justify-between gap-x-3 sm:justify-end">
										{previousPage && (
											<Link
												href={`?page=${previousPage}`}
												className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:ring-slate-400"
											>
												Previous
											</Link>
										)}
										{nextPage && (
											<Link
												href={`?page=${nextPage}`}
												className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:ring-slate-400"
											>
												Next
											</Link>
										)}
									</div>
								</nav>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
