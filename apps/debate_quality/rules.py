import rules

from adhocracy4.modules import predicates as module_predicates

rules.add_perm(
    'a4_candy_debate_quality.add_aiqualitysubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_quality.change_aiqualitysubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_quality.view_aiqualitysubject',
    (module_predicates.is_allowed_moderate_project |
     module_predicates.is_allowed_view_item)
)

rules.add_perm(
    'a4_candy_debate_quality.comment_aiqualitysubject',
    module_predicates.is_allowed_comment_item
)
