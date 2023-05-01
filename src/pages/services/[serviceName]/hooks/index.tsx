import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import {
	ArrowUpCircleIcon,
	ChevronRightIcon,
	PlusIcon,
} from '@heroicons/react/24/solid'
import { Button } from '@/components/Button'
import api from '@/services/api'
import Layout from '@/components/Layout'
import ActivityDot from '@/components/ActivityDot'
import { useAuth } from '@/contexts/Auth'

export default function Webhooks() {
	const { user } = useAuth()

	const router = useRouter()

	const serviceName = router.query.serviceName as string

	const { data: webhooks, isLoading } = useQuery({
		queryKey: ['hooks', serviceName],
		queryFn: () => api.services.hooks.list(serviceName).then(res => res.data),
		enabled: !!serviceName,
	})

	if (!serviceName) {
		return null
	}

	if (isLoading) {
		return 'Loading...'
	}

	return (
		<>
			<Head>
				<title>Webooks - NanoPay.me</title>
			</Head>
			<Layout user={user}>
				<>
					<div className="border-b border-gray-200 pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
						<div className="flex items-center">
							<h1 className="flex-1 text-lg font-medium">Webhooks</h1>
							<Button
								color="nano"
								href={`/services/${serviceName}/hooks/new`}
								className="items-center text-xs py-1"
							>
								<PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
								Create Webhook
							</Button>
						</div>
					</div>
					{webhooks?.length ? (
						<ul
							role="list"
							className="divide-y divide-gray-200 border-b border-gray-200"
						>
							{webhooks?.map(hook => (
								<li
									key={hook.id}
									className="relative py-5 pl-4 pr-6 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
								>
									<div className="flex items-center justify-between space-x-4">
										{/* Service name and description */}
										<div className="min-w-0 space-y-3">
											<div className="flex items-center space-x-3">
												{hook.active ? (
													<ActivityDot status="active" />
												) : (
													<ActivityDot status="inactive" />
												)}
												<h2 className="text-sm font-medium">
													<span
														className="absolute inset-0"
														aria-hidden="true"
													/>
													{hook.name}
												</h2>
											</div>
											<p className="group relative flex items-center space-x-2.5">
												<span className="text-xs font-medium text-gray-500 group-hover:text-gray-900">
													{hook.url}
												</span>
											</p>
										</div>
										<div className="sm:hidden">
											<ChevronRightIcon
												className="h-5 w-5 text-gray-400"
												aria-hidden="true"
											/>
										</div>
										{/* Service meta info */}
										<div className="hidden flex-shrink-0 flex-col items-end space-y-3 sm:flex">
											<p className="flex space-x-2 text-xs text-gray-500">
												<span aria-hidden="true">&middot;</span>
												<span>
													Created at{' '}
													{new Date(hook.created_at).toLocaleDateString(
														undefined,
														{
															month: 'short',
															day: 'numeric',
															year: 'numeric',
														},
													)}
												</span>
											</p>
											{hook.event_types.map(eventType => (
												<p
													className="flex items-center space-x-1"
													key={eventType}
												>
													<ArrowUpCircleIcon className="h-4 w-4 text-gray-400" />
													<span className="text-xs font-semibold text-gray-500">
														{eventType}
													</span>
												</p>
											))}
										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="h-40 flex justify-center items-center">
							<p className="text-gray-500">No webhooks found</p>
						</div>
					)}
				</>
			</Layout>
		</>
	)
}
