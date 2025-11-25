export interface Rule {
  id: number;
  ruleName: string;
  ruleDescription?: string;
  iconUrl?: string;
  ruleType: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRule {
  ruleName: string;
  ruleDescription?: string;
  iconFile: File; // Tương ứng với IFormFile trong C#
  ruleType: string;
  isActive: boolean;
  displayOrder: number;
}

export interface UpdateRule {
  ruleName?: string;
  ruleDescription?: string;
  iconFile?: File;
  imageAction?: "Keep" | "Update" | "Remove";
  ruleType?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface RuleFilter {
  search?: string;
  ruleName?: string;
  ruleType?: string;
  isActive?: boolean;
  sortBy?: string; // mặc định "RuleName"
  sortOrder?: string; // mặc định "asc"
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateHomestayRule {
  ruleId: number;
  customNote?: string;
}

export interface UpdateHomestayRule {
  ruleId: number;
  customNote?: string;
}

export interface UpdateHomestayRules {
  keepRuleIds: number[];
  newRules: CreateHomestayRule[];
  updateExistingRules: UpdateHomestayRule[];
}
