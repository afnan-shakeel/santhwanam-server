/**
 * Controller for Members API
 */
export class MembersController {
    memberService;
    submitRegistrationCmd;
    suspendMemberCmd;
    reactivateMemberCmd;
    closeMemberAccountCmd;
    constructor(memberService, submitRegistrationCmd, suspendMemberCmd, reactivateMemberCmd, closeMemberAccountCmd) {
        this.memberService = memberService;
        this.submitRegistrationCmd = submitRegistrationCmd;
        this.suspendMemberCmd = suspendMemberCmd;
        this.reactivateMemberCmd = reactivateMemberCmd;
        this.closeMemberAccountCmd = closeMemberAccountCmd;
    }
    // ===== STEP 1: PERSONAL DETAILS =====
    /**
     * POST /api/members/register
     * Start member registration (creates in Draft status)
     */
    startRegistration = async (req, res, next) => {
        const member = await this.memberService.startRegistration(req.body);
        next({ dto: "Member", data: member, status: 201 });
    };
    /**
     * PATCH /api/members/:memberId/draft/personal-details
     * Save personal details as draft
     */
    savePersonalDetailsAsDraft = async (req, res, next) => {
        const { memberId } = req.params;
        const member = await this.memberService.savePersonalDetailsAsDraft(memberId, req.body);
        next({ dto: "Member", data: member, status: 200 });
    };
    /**
     * POST /api/members/:memberId/complete/personal-details
     * Complete personal details step
     */
    completePersonalDetailsStep = async (req, res, next) => {
        const { memberId } = req.params;
        const member = await this.memberService.completePersonalDetailsStep(memberId);
        next({ dto: "Member", data: member, status: 200 });
    };
    // ===== STEP 2: NOMINEES =====
    /**
     * POST /api/members/:memberId/nominees
     * Add nominee
     */
    addNominee = async (req, res, next) => {
        const { memberId } = req.params;
        const nominee = await this.memberService.addNominee({
            memberId,
            ...req.body,
        });
        next({ dto: "Nominee", data: nominee, status: 201 });
    };
    /**
     * PATCH /api/members/:memberId/nominees/:nomineeId
     * Update nominee
     */
    updateNominee = async (req, res, next) => {
        const { nomineeId } = req.params;
        const nominee = await this.memberService.updateNominee(nomineeId, req.body);
        next({ dto: "Nominee", data: nominee, status: 200 });
    };
    /**
     * DELETE /api/members/:memberId/nominees/:nomineeId
     * Remove nominee (soft delete)
     */
    removeNominee = async (req, res, next) => {
        const { nomineeId } = req.params;
        await this.memberService.removeNominee(nomineeId);
        next({ status: 204 });
    };
    /**
     * GET /api/members/:memberId/nominees
     * Get all nominees for member
     */
    getNominees = async (req, res, next) => {
        const { memberId } = req.params;
        const nominees = await this.memberService.getNomineesByMemberId(memberId);
        next({ dto: "NomineeList", data: nominees, status: 200 });
    };
    /**
     * POST /api/members/:memberId/complete/nominees
     * Complete nominees step
     */
    completeNomineesStep = async (req, res, next) => {
        const { memberId } = req.params;
        const member = await this.memberService.completeNomineesStep(memberId);
        next({ dto: "Member", data: member, status: 200 });
    };
    // ===== STEP 3: DOCUMENTS & PAYMENT =====
    /**
     * POST /api/members/:memberId/documents
     * Upload member document
     */
    uploadDocument = async (req, res, next) => {
        const { memberId } = req.params;
        const document = await this.memberService.uploadMemberDocument({
            memberId,
            ...req.body,
        });
        next({ dto: "MemberDocument", data: document, status: 201 });
    };
    /**
     * DELETE /api/members/:memberId/documents/:documentId
     * Remove document (soft delete)
     */
    removeDocument = async (req, res, next) => {
        const { documentId } = req.params;
        await this.memberService.removeMemberDocument(documentId);
        next({ status: 204 });
    };
    /**
     * GET /api/members/:memberId/documents
     * Get all documents for member
     */
    getDocuments = async (req, res, next) => {
        const { memberId } = req.params;
        const documents = await this.memberService.getDocumentsByMemberId(memberId);
        next({ dto: "MemberDocumentList", data: documents, status: 200 });
    };
    /**
     * POST /api/members/:memberId/payment
     * Record registration payment
     */
    recordPayment = async (req, res, next) => {
        const { memberId } = req.params;
        const payment = await this.memberService.recordRegistrationPayment({
            memberId,
            ...req.body,
        });
        next({ dto: "RegistrationPayment", data: payment, status: 201 });
    };
    /**
     * GET /api/members/:memberId/payment
     * Get payment for member
     */
    getPayment = async (req, res, next) => {
        const { memberId } = req.params;
        const payment = await this.memberService.getPaymentByMemberId(memberId);
        next({ dto: "RegistrationPayment", data: payment, status: 200 });
    };
    // ===== SUBMISSION =====
    /**
     * POST /api/members/:memberId/submit
     * Submit member registration for approval
     */
    submitRegistration = async (req, res, next) => {
        const { memberId } = req.params;
        const result = await this.submitRegistrationCmd.execute({ memberId });
        next({ dto: "MemberSubmission", data: result, status: 200 });
    };
    // ===== QUERIES =====
    /**
     * GET /api/members/:memberId
     * Get member details with relations
     */
    getMemberDetails = async (req, res, next) => {
        const { memberId } = req.params;
        const member = await this.memberService.getMemberDetails(memberId);
        next({ dto: "MemberDetails", data: member, status: 200 });
    };
    /**
     * GET /api/members
     * List members with filters and pagination
     */
    listMembers = async (req, res, next) => {
        const result = await this.memberService.listMembers(req.query);
        next({ dto: "MemberList", data: result, status: 200 });
    };
    // ===== MEMBER MANAGEMENT =====
    /**
     * POST /api/members/:memberId/suspend
     * Suspend an active member
     */
    suspendMember = async (req, res, next) => {
        const { memberId } = req.params;
        const { reason, suspendedBy } = req.body;
        await this.suspendMemberCmd.execute({ memberId, reason, suspendedBy });
        next({ dto: "Success", data: { success: true }, status: 200 });
    };
    /**
     * POST /api/members/:memberId/reactivate
     * Reactivate a suspended member
     */
    reactivateMember = async (req, res, next) => {
        const { memberId } = req.params;
        const { reactivatedBy } = req.body;
        await this.reactivateMemberCmd.execute({ memberId, reactivatedBy });
        next({ dto: "Success", data: { success: true }, status: 200 });
    };
    /**
     * POST /api/members/:memberId/close
     * Close a member account
     */
    closeMemberAccount = async (req, res, next) => {
        const { memberId } = req.params;
        const { closureReason, walletBalanceRefunded, refundedBy, closureDate } = req.body;
        await this.closeMemberAccountCmd.execute({
            memberId,
            closureReason,
            walletBalanceRefunded,
            refundedBy,
            closureDate: new Date(closureDate),
        });
        next({ dto: "Success", data: { success: true }, status: 200 });
    };
    /**
     * POST /api/members/search
     * Search members with advanced filtering
     */
    searchMembers = async (req, res, next) => {
        const result = await this.memberService.searchMembers(req.body);
        next({ dto: "SearchResult", data: result, status: 200 });
    };
}
