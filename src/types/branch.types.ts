export interface BranchResponse {
  id: string
  name: string
  location: string
  createdAt: string
  updatedAt: string | null
}

export interface CreateBranchPayload {
  name: string
  location: string
}

export interface UpdateBranchPayload {
  name: string
  location: string
}
