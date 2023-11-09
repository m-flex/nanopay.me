'use client'

import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { useMutation, useQuery } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'
import { JSONSchemaType } from 'ajv'

import { Container } from '@/components/Container'
import MButton from '@/components/MButton'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { InvoiceCreate } from '@/types/invoice'
import { INVOICE_MINIMUM_PRICE } from '@/constants'

const schema: JSONSchemaType<InvoiceCreate> = {
	type: 'object',
	properties: {
		title: {
			type: 'string',
			minLength: 2,
			maxLength: 40,
		},
		description: { type: 'string', maxLength: 512, nullable: true },
		price: { type: 'number', minimum: INVOICE_MINIMUM_PRICE },
		recipient_address: {
			type: 'string',
			pattern: '^nano_[13456789abcdefghijkmnopqrstuwxyz]{60}$',
		},
		metadata: { type: 'object', nullable: true },
		redirect_url: {
			type: 'string',
			format: 'uri',
			maxLength: 512,
			nullable: true,
		},
	},
	required: ['title', 'price', 'recipient_address'],
	additionalProperties: false,
}

export default function NewService({
	params: { serviceName },
}: {
	params: {
		serviceName: string
	}
}) {
	const router = useRouter()

	const { showError, showSuccess } = useToast()

	const { data: service, isLoading } = useQuery({
		queryKey: ['service', serviceName],
		queryFn: () => api.services.get(serviceName).then(res => res.data),
	})

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<InvoiceCreate>({
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const {
		mutate: onSubmit,
		isLoading: isSubmitting,
		isSuccess,
	} = useMutation({
		mutationFn: async (data: InvoiceCreate) =>
			api.invoices.create(service?.id as string, data).then(res => res.data),
		onSuccess: res => {
			showSuccess('Invoice created')
			router.push(`/services/${service?.name}/invoices/${res.id}`)
		},
		onError: (err: any) => {
			showError('Error creating service', api.getErrorMessage(err))
		},
	})

	const onErrorSubmiting = () => {
		showError('Error creating service', 'Check the fields entered')
	}

	if (!serviceName) {
		return null
	}

	if (!isLoading && !service) {
		return (
			<>
				<Head>
					<title>Invoice - NanoPay.me</title>
				</Head>
				<Container>
					<div>Something went wrong!</div>
				</Container>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>Invoice - NanoPay.me</title>
			</Head>
			<Container className="sm:mt-4 w-full max-w-xl h-screen sm:h-auto flex flex-col items-center space-y-6 bg-white py-8 px-16 pb-16 shadow sm:rounded-lg">
				<div className="w-full max-w-xl flex flex-col space-y-6 px-4 sm:px-8 pb-4">
					<div className="w-full flex items-center justify-between space-x-8">
						<h1 className="text-lg font-semibold text-slate-600">
							New Invoice
						</h1>
						<div />
					</div>

					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<Input
								label="Title"
								{...field}
								onChange={e => field.onChange(e.target.value)}
								errorMessage={errors.title?.message}
								className="w-full"
								autoCapitalize="words"
								style={{
									textTransform: 'capitalize',
								}}
								disabled={isSubmitting || isSuccess}
							/>
						)}
					/>

					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<Input
								label="Description (optional)"
								{...field}
								onChange={e => field.onChange(e.target.value.slice(0, 512))}
								errorMessage={errors.description?.message}
								className="w-full"
								multiline={true}
								disabled={isSubmitting || isSuccess}
							/>
						)}
					/>

					<Controller
						name="price"
						control={control}
						render={({ field }) => (
							<Input
								label="Price / Amount"
								type="number"
								{...field}
								onChange={e => field.onChange(Number(e.target.value))}
								errorMessage={errors.price?.message}
								className="w-full"
								autoCapitalize="words"
								style={{
									textTransform: 'capitalize',
								}}
								disabled={isSubmitting || isSuccess}
							/>
						)}
					/>

					<Controller
						name="recipient_address"
						control={control}
						render={({ field }) => (
							<Input
								label="Recipient Nano Address"
								{...field}
								onChange={e => field.onChange(e.target.value)}
								errorMessage={errors.recipient_address?.message}
								className="w-full"
								autoCapitalize="words"
								style={{
									textTransform: 'capitalize',
								}}
								disabled={isSubmitting || isSuccess}
							/>
						)}
					/>

					<Controller
						name="redirect_url"
						control={control}
						render={({ field }) => (
							<Input
								label="Redirect URL (optional)"
								{...field}
								onChange={e => field.onChange(e.target.value)}
								errorMessage={errors.redirect_url?.message}
								className="w-full"
								type="url"
								disabled={isSubmitting || isSuccess}
							/>
						)}
					/>
				</div>

				<MButton
					onClick={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
					loading={isSubmitting}
					disabled={
						isSuccess ||
						!watch('title') ||
						!watch('price') ||
						!watch('recipient_address')
					}
				>
					{isSubmitting ? 'Creating Invoice...' : 'Create Invoice'}
				</MButton>
			</Container>
		</>
	)
}
