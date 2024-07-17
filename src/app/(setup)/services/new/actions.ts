'use server'

import { serviceCreateSchema } from '@/core/client'
import { createClient, getUserId } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { safeAction } from '@/lib/safe-action'

export const createService = safeAction
	.schema(serviceCreateSchema)
	.action(async ({ parsedInput: { name, avatar_url } }) => {
		const userId = await getUserId(cookies())

		const supabase = createClient(cookies())

		const serviceId = randomUUID()

		const { error } = await supabase.from('services').insert({
			id: serviceId,
			user_id: userId,
			name,
			display_name: name,
			avatar_url: avatar_url,
		})

		if (error) {
			throw new Error(error.message)
		}

		revalidateTag(`user-${userId}-services`)

		redirect(`/${name}?new=true`)
	})
