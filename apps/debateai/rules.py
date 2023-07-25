import rules

from adhocracy4.modules import predicates as module_predicates

rules.add_perm(
    'a4_candy_debateai.add_aisubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debateai.change_aisubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debateai.view_aisubject',
    (module_predicates.is_allowed_moderate_project |
     module_predicates.is_allowed_view_item)
)

rules.add_perm(
    'a4_candy_debateai.comment_aisubject',
    module_predicates.is_allowed_comment_item
)
