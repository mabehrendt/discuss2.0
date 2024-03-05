import rules

from adhocracy4.modules import predicates as module_predicates

rules.add_perm(
    'a4_candy_debate_quality_random.add_qualityrandomsubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_quality_random.change_qualityrandomsubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_quality_random.view_qualityrandomsubject',
    (module_predicates.is_allowed_moderate_project |
     module_predicates.is_allowed_view_item)
)

rules.add_perm(
    'a4_candy_debate_quality_random.comment_qualityrandomsubject',
    module_predicates.is_allowed_comment_item
)
