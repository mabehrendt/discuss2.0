import rules

from adhocracy4.modules import predicates as module_predicates

rules.add_perm(
    'a4_candy_debate_ai.add_subject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_ai.change_subject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_ai.view_subject',
    (module_predicates.is_allowed_moderate_project |
     module_predicates.is_allowed_view_item)
)

rules.add_perm(
    'a4_candy_debate_ai.comment_subject',
    module_predicates.is_allowed_comment_item
)
