export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			account: {
				Row: {
					balance: number;
					closed_at: string | null;
					created_at: string;
					id: string;
					person_id: string | null;
					status: string;
					type: Database['public']['Enums']['account_type'];
				};
				Insert: {
					balance?: number;
					closed_at?: string | null;
					created_at?: string;
					id?: string;
					person_id?: string | null;
					status?: string;
					type: Database['public']['Enums']['account_type'];
				};
				Update: {
					balance?: number;
					closed_at?: string | null;
					created_at?: string;
					id?: string;
					person_id?: string | null;
					status?: string;
					type?: Database['public']['Enums']['account_type'];
				};
				Relationships: [
					{
						foreignKeyName: 'account_person_id_fkey';
						columns: ['person_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['person_id'];
					},
					{
						foreignKeyName: 'account_person_id_fkey';
						columns: ['person_id'];
						isOneToOne: false;
						referencedRelation: 'person';
						referencedColumns: ['id'];
					},
				];
			};
			deposits: {
				Row: {
					account_id: string;
					amount: number;
					created_at: string;
					gateway: string;
					gateway_response: Json | null;
					id: string;
					status: Database['public']['Enums']['transaction_status'];
					updated_at: string | null;
				};
				Insert: {
					account_id?: string;
					amount?: number;
					created_at?: string;
					gateway: string;
					gateway_response?: Json | null;
					id?: string;
					status?: Database['public']['Enums']['transaction_status'];
					updated_at?: string | null;
				};
				Update: {
					account_id?: string;
					amount?: number;
					created_at?: string;
					gateway?: string;
					gateway_response?: Json | null;
					id?: string;
					status?: Database['public']['Enums']['transaction_status'];
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'deposit_account_id_fkey';
						columns: ['account_id'];
						isOneToOne: false;
						referencedRelation: 'account';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'deposit_account_id_fkey';
						columns: ['account_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['account_id'];
					},
				];
			};
			expo_push_token: {
				Row: {
					created_at: string;
					expo_push_token: string;
					id: string;
					person_id: string | null;
				};
				Insert: {
					created_at?: string;
					expo_push_token: string;
					id?: string;
					person_id?: string | null;
				};
				Update: {
					created_at?: string;
					expo_push_token?: string;
					id?: string;
					person_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'expo_token_person_id_fkey';
						columns: ['person_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['person_id'];
					},
					{
						foreignKeyName: 'expo_token_person_id_fkey';
						columns: ['person_id'];
						isOneToOne: false;
						referencedRelation: 'person';
						referencedColumns: ['id'];
					},
				];
			};
			notification: {
				Row: {
					body: string | null;
					created_at: string;
					data: Json | null;
					id: string;
					person_id: string | null;
					title: string | null;
					type: string | null;
				};
				Insert: {
					body?: string | null;
					created_at?: string;
					data?: Json | null;
					id?: string;
					person_id?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Update: {
					body?: string | null;
					created_at?: string;
					data?: Json | null;
					id?: string;
					person_id?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'notification_person_id_fkey';
						columns: ['person_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['person_id'];
					},
					{
						foreignKeyName: 'notification_person_id_fkey';
						columns: ['person_id'];
						isOneToOne: false;
						referencedRelation: 'person';
						referencedColumns: ['id'];
					},
				];
			};
			person: {
				Row: {
					avatar_url: string | null;
					created_at: string;
					date_of_birth: string | null;
					email: string;
					first_name: string | null;
					id: string;
					identity_tag: string | null;
					last_name: string | null;
					middle_name: string | null;
					phone: string | null;
					status: string | null;
					updated_at: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string;
					date_of_birth?: string | null;
					email: string;
					first_name?: string | null;
					id?: string;
					identity_tag?: string | null;
					last_name?: string | null;
					middle_name?: string | null;
					phone?: string | null;
					status?: string | null;
					updated_at?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string;
					date_of_birth?: string | null;
					email?: string;
					first_name?: string | null;
					id?: string;
					identity_tag?: string | null;
					last_name?: string | null;
					middle_name?: string | null;
					phone?: string | null;
					status?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			transaction: {
				Row: {
					amount: number;
					created_at: string;
					destination_account_id: string | null;
					destination_new_balance: number;
					destination_old_balance: number;
					id: string;
					is_flagged_fraud: boolean;
					is_fraud: boolean;
					message: string | null;
					origin_account_id: string | null;
					origin_new_balance: number;
					origin_old_balance: number;
					reference: string;
					status: Database['public']['Enums']['transaction_status'];
					type: Database['public']['Enums']['transaction_type'];
				};
				Insert: {
					amount: number;
					created_at?: string;
					destination_account_id?: string | null;
					destination_new_balance?: number;
					destination_old_balance?: number;
					id?: string;
					is_flagged_fraud?: boolean;
					is_fraud?: boolean;
					message?: string | null;
					origin_account_id?: string | null;
					origin_new_balance?: number;
					origin_old_balance?: number;
					reference: string;
					status: Database['public']['Enums']['transaction_status'];
					type: Database['public']['Enums']['transaction_type'];
				};
				Update: {
					amount?: number;
					created_at?: string;
					destination_account_id?: string | null;
					destination_new_balance?: number;
					destination_old_balance?: number;
					id?: string;
					is_flagged_fraud?: boolean;
					is_fraud?: boolean;
					message?: string | null;
					origin_account_id?: string | null;
					origin_new_balance?: number;
					origin_old_balance?: number;
					reference?: string;
					status?: Database['public']['Enums']['transaction_status'];
					type?: Database['public']['Enums']['transaction_type'];
				};
				Relationships: [
					{
						foreignKeyName: 'transaction_destination_account_id_fkey';
						columns: ['destination_account_id'];
						isOneToOne: false;
						referencedRelation: 'account';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'transaction_destination_account_id_fkey';
						columns: ['destination_account_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['account_id'];
					},
					{
						foreignKeyName: 'transaction_origin_account_id_fkey';
						columns: ['origin_account_id'];
						isOneToOne: false;
						referencedRelation: 'account';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'transaction_origin_account_id_fkey';
						columns: ['origin_account_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['account_id'];
					},
				];
			};
			user_contacts: {
				Row: {
					contact_id: string;
					user_id: string;
				};
				Insert: {
					contact_id: string;
					user_id: string;
				};
				Update: {
					contact_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_contacts_contact_id_fkey';
						columns: ['contact_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['person_id'];
					},
					{
						foreignKeyName: 'user_contacts_contact_id_fkey';
						columns: ['contact_id'];
						isOneToOne: false;
						referencedRelation: 'person';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_contacts_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['person_id'];
					},
					{
						foreignKeyName: 'user_contacts_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'person';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Views: {
			account_details: {
				Row: {
					account_id: string | null;
					avatar_url: string | null;
					display_name: string | null;
					email: string | null;
					identity_tag: string | null;
					person_id: string | null;
					phone: string | null;
				};
				Relationships: [];
			};
			account_transactions: {
				Row: {
					amount: number | null;
					created_at: string | null;
					destination_account_id: string | null;
					destination_avatar_url: string | null;
					destination_display_name: string | null;
					id: string | null;
					message: string | null;
					origin_account_id: string | null;
					origin_avatar_url: string | null;
					origin_display_name: string | null;
					type: Database['public']['Enums']['transaction_type'] | null;
				};
				Relationships: [
					{
						foreignKeyName: 'transaction_destination_account_id_fkey';
						columns: ['destination_account_id'];
						isOneToOne: false;
						referencedRelation: 'account';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'transaction_destination_account_id_fkey';
						columns: ['destination_account_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['account_id'];
					},
					{
						foreignKeyName: 'transaction_origin_account_id_fkey';
						columns: ['origin_account_id'];
						isOneToOne: false;
						referencedRelation: 'account';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'transaction_origin_account_id_fkey';
						columns: ['origin_account_id'];
						isOneToOne: false;
						referencedRelation: 'account_details';
						referencedColumns: ['account_id'];
					},
				];
			};
		};
		Functions: {
			make_transfer: {
				Args: {
					amount: number;
					origin_account_id: string;
					destination_account_id: string;
					reference: string;
					message: string;
				};
				Returns: string;
			};
		};
		Enums: {
			account_type: 'individual';
			transaction_status:
				| 'pending'
				| 'in_progress'
				| 'completed'
				| 'failed'
				| 'canceled'
				| 'on_hold'
				| 'reversed'
				| 'expired'
				| 'refunded';
			transaction_type:
				| 'deposit'
				| 'withdrawal'
				| 'transfer'
				| 'payment'
				| 'purchase'
				| 'refund'
				| 'fee'
				| 'interest'
				| 'cashback'
				| 'adjustment'
				| 'chargeback'
				| 'reversal';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes'] | { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;
