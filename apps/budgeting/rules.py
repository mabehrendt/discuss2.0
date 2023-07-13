import rules

from adhocracy4.modules import predicates as module_predicates

from . import models

rules.add_perm(
    "a4_candy_budgeting.view_proposal", module_predicates.is_allowed_view_item
)


rules.add_perm(
    "a4_candy_budgeting.add_proposal",
    module_predicates.is_allowed_add_item(models.Proposal),
)

rules.add_perm(
    "a4_candy_budgeting.rate_proposal", module_predicates.is_allowed_rate_item
)


rules.add_perm(
    "a4_candy_budgeting.comment_proposal", module_predicates.is_allowed_comment_item
)


rules.add_perm(
    "a4_candy_budgeting.change_proposal", module_predicates.is_allowed_change_item
)


rules.add_perm(
    "a4_candy_budgeting.moderate_proposal",
    module_predicates.is_allowed_moderate_project,
)
